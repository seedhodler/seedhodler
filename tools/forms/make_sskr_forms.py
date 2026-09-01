#!/usr/bin/env python3
"""Seedhodler SSKR share forms.

Two pages, print either as often as needed:
  page 1 - 41 bytewords (share of a 24-word seed)
  page 2 - 25 bytewords (share of a 12-word seed)

Same layout as the SLIP-0039 share form (make_shard_forms_en.py); only the
scheme-specific text differs: the badge reads SSKR, the words are bytewords,
and the warning and recovery notes match Blockchain Commons SSKR. Share number
and threshold are filled in by hand. No em dashes anywhere.
"""
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from svglib.svglib import svg2rlg

import make_shard_forms_en as base
from make_shard_forms_en import (
    box, kopf, felder, W, H, RAND, NUTZ,
    BADGE_BG, BADGE_TXT, TXT, TXT_GRAU, TXT_MITTEL,
    WARN_BG, WARN_LINE, WARN_TXT,
)

DATEIEN = {41: "ShareForm41.pdf", 25: "ShareForm25.pdf"}
LOGO = str(Path(__file__).with_name("Logo.svg"))
VERSION = base.VERSION  # keep the form version in lockstep with the SLIP-0039 set


def warnung(c, y):
    h = 13.5 * mm
    c.setFillColor(WARN_BG)
    c.setStrokeColor(WARN_LINE)
    c.setLineWidth(1)
    c.roundRect(RAND, y - h, NUTZ, h, 2.2 * mm, stroke=1, fill=1)

    c.setFont("Helvetica-Bold", 9.8)
    c.setFillColor(WARN_TXT)
    c.drawString(RAND + 4 * mm, y - 5.5 * mm,
                 "These are SSKR bytewords, not a wallet phrase. A hardware wallet does not accept them.")
    c.setFont("Helvetica", 8.4)
    c.setFillColor(TXT_MITTEL)
    c.drawString(RAND + 4 * mm, y - 10.4 * mm,
                 "Restore them at seedhodler.io or with any Blockchain Commons tool (for example bc-seedtool).")
    return y - h - 5.5 * mm


def badge_zeile(c, y, woerter):
    c.setFont("Helvetica-Bold", 9.8)
    c.setFillColor(TXT)
    c.drawString(RAND, y, "Bytewords of this share")

    seed_len = 24 if woerter == 41 else 12
    c.setFont("Helvetica", 8)
    c.setFillColor(TXT_GRAU)
    c.drawString(RAND + 40 * mm, y + 0.3 * mm,
                 "%d bytewords, in this order, from a %d-word seed" % (woerter, seed_len))

    text = "SSKR"
    c.setFont("Helvetica-Bold", 8.6)
    tb = c.stringWidth(text, "Helvetica-Bold", 8.6) + 7 * mm
    c.setFillColor(BADGE_BG)
    c.roundRect(W - RAND - tb, y - 2.2 * mm, tb, 7 * mm, 1.8 * mm, stroke=0, fill=1)
    c.setFillColor(BADGE_TXT)
    c.drawCentredString(W - RAND - tb / 2, y + 0.2 * mm, text)
    return y - 6 * mm


def fuss(c, top):
    h = 11 * mm
    box(c, RAND, top - h, NUTZ, h,
        "Check address (first receiving address of the wallet):")
    y = top - h - 4 * mm

    c.setFont("Helvetica-Oblique", 7.6)
    c.setFillColor(TXT_GRAU)
    c.drawString(RAND, y,
                 "If it does not match after recovery, the result is wrong, "
                 "even when it looks perfectly valid.")

    # --- recovery -------------------------------------------------------
    y -= 5 * mm
    h2 = 27 * mm
    box(c, RAND, y - h2, NUTZ, h2)
    c.setFont("Helvetica-Bold", 8.4)
    c.setFillColor(TXT)
    c.drawString(RAND + 3 * mm, y - 5.2 * mm, "Recovery")

    lx = RAND + 3 * mm
    tx = RAND + 36 * mm
    zeilen = [
        ("How this was made",
         "BIP-39 mnemonic -> entropy -> split into shares (SSKR, bytewords)", None),
        ("To restore",
         "enter enough shares at seedhodler.io and it returns your mnemonic", None),
        ("Without the tool",
         "any SSKR / Blockchain Commons tool returns the raw secret. Those bytes ARE",
         "the BIP-39 entropy. Encode them back into a BIP-39 mnemonic."),
    ]
    yy = y - 10 * mm
    for label, t1, t2 in zeilen:
        c.setFont("Helvetica-Bold", 7.4)
        c.setFillColor(TXT_GRAU)
        c.drawString(lx, yy, label)
        c.setFont("Helvetica", 7.6)
        c.setFillColor(TXT_MITTEL)
        c.drawString(tx, yy, t1)
        yy -= 4.4 * mm
        if t2:
            c.drawString(tx, yy, t2)
            yy -= 4.4 * mm

    # --- footer ---------------------------------------------------------
    y -= h2 + 5 * mm
    hf = 13 * mm
    box(c, RAND, y - hf, NUTZ, hf,
        "A single share is useless on its own. If found, please contact:")

    c.setFont("Helvetica", 6.8)
    c.setFillColor(TXT_GRAU)
    c.drawRightString(W - RAND, y - hf - 3.2 * mm, "seedhodler.io  ·  form %s" % VERSION)


def blatt(c, woerter, logo):
    y = kopf(c, woerter, logo)
    y = warnung(c, y)
    y = badge_zeile(c, y, woerter)
    fuss_top = RAND + 66 * mm
    felder(c, y, woerter, fuss_top + 5 * mm)
    fuss(c, fuss_top)
    c.showPage()


def main():
    import subprocess
    logo = svg2rlg(LOGO)
    for woerter, datei in DATEIEN.items():
        # invariant: fixed date and document id, so two runs are byte-identical
        # and the committed PDF is reproducible from this script.
        c = canvas.Canvas(datei, pagesize=A4, invariant=1)
        seed_len = 24 if woerter == 41 else 12
        c.setTitle("Seedhodler SSKR Share Form (%d bytewords, %d-word seed)" % (woerter, seed_len))
        blatt(c, woerter, logo)
        c.save()

        txt = subprocess.run(["pdftotext", datei, "-"], capture_output=True, text=True).stdout
        dashes = [ch for ch in ("—", "–") if ch in txt]
        print("%-20s 1 Seite, %2d Bytewords, %d-Wort-Seed, Dashes: %s"
              % (datei, woerter, seed_len, dashes if dashes else "keine"))


if __name__ == "__main__":
    main()
