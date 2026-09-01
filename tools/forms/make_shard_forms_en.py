#!/usr/bin/env python3
"""Seedhodler share forms, generic version.

Two pages, print either as often as needed:
  page 1 - 33 words (share of a 24-word seed)
  page 2 - 20 words (share of a 12-word seed)

Share number and threshold are filled in by hand, so one document covers
every split. No em dashes anywhere.
"""
from pathlib import Path
from reportlab.graphics import renderPDF
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from svglib.svglib import svg2rlg

DATEIEN = {33: "Seedhodler-Share-Form-33.pdf",
           20: "Seedhodler-Share-Form-20.pdf"}
LOGO = str(Path(__file__).with_name("Logo.svg"))
VERSION = "v3.0"

# --- brand colours, taken from the original form --------------------------
GRUEN = HexColor("#78bb58")
BADGE_BG = HexColor("#b5e5cb")
BADGE_TXT = HexColor("#0b7f4e")
BOX = HexColor("#e6e7ea")
TXT = HexColor("#1a1d1f")
TXT_GRAU = HexColor("#5f666e")
TXT_MITTEL = HexColor("#24282e")
LINIE = HexColor("#9aa0a6")
WARN_BG = HexColor("#ffeee8")
WARN_LINE = HexColor("#fc4747")
WARN_TXT = HexColor("#b32b1f")

W, H = A4
RAND = 13 * mm
NUTZ = W - 2 * RAND


def box(c, x, y, b, h, label=None, fill=BOX, r=2.2 * mm):
    c.setFillColor(fill)
    c.setStrokeColor(fill)
    c.roundRect(x, y, b, h, r, stroke=0, fill=1)
    if label:
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(TXT_GRAU)
        c.drawString(x + 3 * mm, y + h - 5.2 * mm, label)


def schreiblinie(c, x, y, b):
    c.setStrokeColor(LINIE)
    c.setLineWidth(0.9)
    c.line(x, y, x + b, y)


def kopf(c, woerter, logo):
    y = H - RAND

    ziel_b = 46 * mm
    s = ziel_b / logo.width
    logo.scale(s, s)
    logo.width *= s
    logo.height *= s
    renderPDF.draw(logo, c, (W - ziel_b) / 2, y - 14 * mm)
    logo.scale(1 / s, 1 / s)
    logo.width /= s
    logo.height /= s

    c.setFont("Helvetica", 8.5)
    c.setFillColor(TXT_MITTEL)
    c.setFont("Helvetica", 9.5)
    c.drawCentredString(W / 2, y - 20 * mm,
                        "One part of a split seed. Worthless alone, whole together.")

    # --- header fields, all filled in by hand ---------------------------
    y -= 26 * mm
    h = 12.5 * mm
    luft = 3.5 * mm
    b1 = NUTZ * 0.35
    b2 = NUTZ * 0.18
    b3 = NUTZ * 0.22
    b4 = NUTZ - b1 - b2 - b3 - 3 * luft

    box(c, RAND, y - h, b1, h, "Wallet / label:")

    x2 = RAND + b1 + luft
    box(c, x2, y - h, b2, h, "Created on:")

    # Share __ of __
    x3 = x2 + b2 + luft
    box(c, x3, y - h, b3, h, "Share:")
    c.setFont("Helvetica", 9)
    c.setFillColor(TXT_GRAU)
    mitte = x3 + b3 / 2
    c.drawCentredString(mitte, y - h + 3.4 * mm, "of")
    schreiblinie(c, x3 + 3.5 * mm, y - h + 3 * mm, b3 / 2 - 6 * mm)
    schreiblinie(c, mitte + 2.5 * mm, y - h + 3 * mm, b3 / 2 - 6 * mm)

    # threshold
    x4 = x3 + b3 + luft
    box(c, x4, y - h, b4, h, "Shares needed:")
    schreiblinie(c, x4 + 3.5 * mm, y - h + 3 * mm, b4 - 7 * mm)

    return y - h - 6 * mm


def warnung(c, y):
    h = 13.5 * mm
    c.setFillColor(WARN_BG)
    c.setStrokeColor(WARN_LINE)
    c.setLineWidth(1)
    c.roundRect(RAND, y - h, NUTZ, h, 2.2 * mm, stroke=1, fill=1)

    c.setFont("Helvetica-Bold", 9.8)
    c.setFillColor(WARN_TXT)
    c.drawString(RAND + 4 * mm, y - 5.5 * mm,
                 "Do NOT enter these words into a Trezor or any other hardware wallet.")
    c.setFont("Helvetica", 8.4)
    c.setFillColor(TXT_MITTEL)
    c.drawString(RAND + 4 * mm, y - 10.4 * mm,
                 "The device accepts them without any error and opens a different, empty wallet.")
    return y - h - 5.5 * mm


def badge_zeile(c, y, woerter):
    c.setFont("Helvetica-Bold", 9.8)
    c.setFillColor(TXT)
    c.drawString(RAND, y, "Words of this share")

    seed_len = 24 if woerter == 33 else 12
    c.setFont("Helvetica", 8)
    c.setFillColor(TXT_GRAU)
    c.drawString(RAND + 37 * mm, y + 0.3 * mm,
                 "%d words, in this order, from a %d-word seed" % (woerter, seed_len))

    text = "SLIP-0039"
    c.setFont("Helvetica-Bold", 8.6)
    tb = c.stringWidth(text, "Helvetica-Bold", 8.6) + 7 * mm
    c.setFillColor(BADGE_BG)
    c.roundRect(W - RAND - tb, y - 2.2 * mm, tb, 7 * mm, 1.8 * mm, stroke=0, fill=1)
    c.setFillColor(BADGE_TXT)
    c.drawCentredString(W - RAND - tb / 2, y + 0.2 * mm, text)
    return y - 6 * mm


def felder(c, y_start, woerter, y_min):
    links = (woerter + 1) // 2
    dy = min(14 * mm, (y_start - y_min) / links)
    hoehe = min(9.5 * mm, dy - 2.2 * mm)

    sp = (NUTZ - 5 * mm) / 2
    for i in range(woerter):
        spalte, zeile = (0, i) if i < links else (1, i - links)
        x = RAND + spalte * (sp + 5 * mm)
        y = y_start - (zeile + 1) * dy
        box(c, x, y, sp, hoehe)
        c.setFont("Helvetica-Bold", 8.4)
        c.setFillColor(TXT_GRAU)
        c.drawString(x + 3 * mm, y + hoehe / 2 - 1.2 * mm, "%d." % (i + 1))


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
         "BIP-39 mnemonic -> entropy -> split into shares (SLIP-0039)", None),
        ("To restore",
         "enter enough shares at seedhodler.io and it returns your mnemonic", None),
        ("Without the tool",
         "any SLIP-0039 library returns raw bytes. Those bytes ARE the BIP-39",
         "entropy. Encode them back into a BIP-39 mnemonic."),
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
        c = canvas.Canvas(datei, pagesize=A4)
        seed_len = 24 if woerter == 33 else 12
        c.setTitle("Seedhodler Share Form (%d words, %d-word seed)" % (woerter, seed_len))
        blatt(c, woerter, logo)
        c.save()

        txt = subprocess.run(["pdftotext", datei, "-"], capture_output=True, text=True).stdout
        dashes = [ch for ch in ("\u2014", "\u2013") if ch in txt]
        print("%-32s 1 Seite, %2d Woerter, %d-Wort-Seed, Dashes: %s"
              % (datei, woerter, seed_len, dashes if dashes else "keine"))


if __name__ == "__main__":
    main()
