#!/usr/bin/env python3
"""Wallet profile. One sheet per wallet, print eight of them.

Describes the wallet, does not open it: no seed words, no passphrase. Just the
details that make 24 words alone useless if they are missing: path, address
type, fingerprint, check address. English only.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

from sh_brand import (RAND, TXT, TXT_GRAU, TXT_MITTEL, box, fusszeile, kopf,
                      logo_laden, pruefen, schreiblinie, wahl, warnbox)

DATEI = "WalletProfile.pdf"
VERSION = "v1.0"
W, H = A4
NUTZ = W - 2 * RAND


def gitter(c, y, titel, zeilen, zh=10 * mm, kh=10 * mm, luft=5 * mm):
    h = kh + len(zeilen) * zh
    box(c, RAND, y - h, NUTZ, h, titel)
    yy = y - kh - 4 * mm
    for reihe in zeilen:
        gesamt = sum(g for _, g in reihe)
        verf = NUTZ - 6 * mm - (len(reihe) - 1) * 5 * mm
        x = RAND + 3 * mm
        for label, g in reihe:
            b = verf * g / gesamt
            c.setFont("Helvetica-Bold", 7.4)
            c.setFillColor(TXT_GRAU)
            c.drawString(x, yy + 2.8 * mm, label)
            schreiblinie(c, x, yy, b)
            x += b + 5 * mm
        yy -= zh
    return y - h - luft


def ankreuzzeile(c, x, y, label, optionen, nachfeld=None):
    c.setFont("Helvetica-Bold", 7.4)
    c.setFillColor(TXT_GRAU)
    c.drawString(x, y + 0.3 * mm, label)
    ende = wahl(c, x + 30 * mm, y, optionen)
    if nachfeld:
        c.setFont("Helvetica-Bold", 7.4)
        c.setFillColor(TXT_GRAU)
        c.drawString(ende, y + 0.3 * mm, nachfeld)
        bb = c.stringWidth(nachfeld, "Helvetica-Bold", 7.4)
        schreiblinie(c, ende + bb + 2 * mm, y - 1 * mm,
                     RAND + NUTZ - 3 * mm - ende - bb - 2 * mm)


def blatt(c, logo):
    y = kopf(c, W, H, logo, "Wallet profile",
             "One sheet per wallet. Describes the wallet, does not open it.")

    y = gitter(c, y, "Basic details",
               [[("Label / name", 2), ("Created on", 1)],
                [("Device (make, model)", 2), ("Serial number", 1)]])

    # --- Seed and passphrase ---------------------------------------------
    h = 24 * mm
    box(c, RAND, y - h, NUTZ, h, "Seed and passphrase")
    ankreuzzeile(c, RAND + 3 * mm, y - 13 * mm, "Length",
                 ["12 words", "24 words"])
    ankreuzzeile(c, RAND + 3 * mm, y - 20 * mm, "Passphrase",
                 ["none", "yes"], "kept at:")
    y -= h + 5 * mm

    # --- Derivation ------------------------------------------------------
    h = 40 * mm
    box(c, RAND, y - h, NUTZ, h, "Derivation and check")
    ankreuzzeile(c, RAND + 3 * mm, y - 14 * mm, "Address type",
                 ["Legacy 44'", "SegWit 49'", "Native SegWit 84'", "Taproot 86'"])

    yy = y - 25 * mm
    verf = (NUTZ - 6 * mm - 5 * mm) / 2
    for i, label in enumerate(("Derivation path", "Master fingerprint")):
        x = RAND + 3 * mm + i * (verf + 5 * mm)
        c.setFont("Helvetica-Bold", 7.4)
        c.setFillColor(TXT_GRAU)
        c.drawString(x, yy + 2.8 * mm, label)
        schreiblinie(c, x, yy, verf)

    yy -= 11 * mm
    c.setFont("Helvetica-Bold", 7.4)
    c.setFillColor(TXT_GRAU)
    c.drawString(RAND + 3 * mm, yy + 2.8 * mm,
                 "Check address (first receiving address)")
    schreiblinie(c, RAND + 3 * mm, yy, NUTZ - 6 * mm)
    y -= h + 5 * mm

    # --- Split -----------------------------------------------------------
    h = 31 * mm
    box(c, RAND, y - h, NUTZ, h, "Split")
    ankreuzzeile(c, RAND + 3 * mm, y - 14 * mm, "Split",
                 ["not split", "split"], "Threshold:")
    ankreuzzeile(c, RAND + 3 * mm, y - 21 * mm, "Form",
                 ["33 words", "20 words", "n/a"])
    c.setFont("Helvetica-Oblique", 7.4)
    c.setFillColor(TXT_GRAU)
    c.drawString(RAND + 3 * mm, y - 27.5 * mm,
                 "Where the envelopes are kept is recorded only in the custody "
                 "overview, not on this sheet.")
    y -= h + 5 * mm

    y = gitter(c, y, "Use and notes",
               [[("", 1)], [("", 1)], [("", 1)]], zh=9 * mm)

    y = gitter(c, y, "Last check",
               [[("Date", 1), ("Result", 2)]], zh=10 * mm)

    warnbox(c, RAND, y, NUTZ,
            "No seed words and no passphrase belong on this sheet.",
            ["It does not open the wallet, but it makes a found seed usable at once.",
             "So it still belongs in the safe, not in a file folder."])

    fusszeile(c, W, "Wallet profile %s" % VERSION)
    c.showPage()


def main():
    logo = logo_laden()
    c = canvas.Canvas(DATEI, pagesize=A4, invariant=1)
    c.setTitle("Seedhodler Wallet Profile")
    blatt(c, logo)
    c.save()
    pruefen(DATEI)


if __name__ == "__main__":
    main()
