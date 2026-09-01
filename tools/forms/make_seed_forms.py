#!/usr/bin/env python3
"""Seedhodler seed forms: the BIP-39 mnemonic itself.

Gegenstueck zu den Share-Vordrucken. Bewusst ein eigenes Blatt, damit
Seed und Teilstueck nie auf demselben Papier stehen.

Inhaltlich anders als das Share-Formular:
  - Badge sagt BIP-39, denn hier stimmt es
  - keine Trezor-Warnung, diese Woerter gehoeren in ein Wallet
  - stattdessen: dieses Blatt allein gibt Vollzugriff
  - Hinweis, es nach dem Aufteilen und Pruefen zu vernichten
  - Vermerk, DASS eine Passphrase existiert und wo, nie welche
"""
from pathlib import Path
from reportlab.graphics import renderPDF
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from svglib.svglib import svg2rlg

DATEIEN = {24: "Seedhodler-Seed-Form-24.pdf",
           12: "Seedhodler-Seed-Form-12.pdf"}
LOGO = str(Path(__file__).with_name("Logo.svg"))
VERSION = "v3.0"

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


def kopf(c, logo):
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

    c.setFont("Helvetica", 9.5)
    c.setFillColor(TXT_MITTEL)
    c.drawCentredString(W / 2, y - 20 * mm,
                        "The complete seed. Not safe to lose, not safe to keep.")

    y -= 26 * mm
    h = 12.5 * mm
    luft = 3.5 * mm
    b1 = NUTZ * 0.42
    b2 = NUTZ * 0.20
    b3 = NUTZ - b1 - b2 - 2 * luft

    box(c, RAND, y - h, b1, h, "Wallet / label:")
    x2 = RAND + b1 + luft
    box(c, x2, y - h, b2, h, "Created on:")

    x3 = x2 + b2 + luft
    box(c, x3, y - h, b3, h, "Passphrase set? Kept where:")
    schreiblinie(c, x3 + 3.5 * mm, y - h + 3 * mm, b3 - 7 * mm)
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
                 "This sheet alone opens the wallet. Treat it like the funds themselves.")
    c.setFont("Helvetica", 8.4)
    c.setFillColor(TXT_MITTEL)
    c.drawString(RAND + 4 * mm, y - 10.4 * mm,
                 "Once every share is written down and verified, destroying this sheet "
                 "removes the single point of failure.")
    return y - h - 5.5 * mm


def badge_zeile(c, y, woerter):
    c.setFont("Helvetica-Bold", 9.8)
    c.setFillColor(TXT)
    c.drawString(RAND, y, "Words of your seed")

    shares = 33 if woerter == 24 else 20
    c.setFont("Helvetica", 8)
    c.setFillColor(TXT_GRAU)
    c.drawString(RAND + 37 * mm, y + 0.3 * mm,
                 "%d words, in this order, splits into %d-word shares" % (woerter, shares))

    text = "BIP-39"
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
                 "Write it down before splitting. It is the only way to tell a correct "
                 "recovery from a plausible one.")

    y -= 5 * mm
    h2 = 27 * mm
    box(c, RAND, y - h2, NUTZ, h2)
    c.setFont("Helvetica-Bold", 8.4)
    c.setFillColor(TXT)
    c.drawString(RAND + 3 * mm, y - 5.2 * mm, "About this sheet")

    lx = RAND + 3 * mm
    tx = RAND + 36 * mm
    zeilen = [
        ("What this is",
         "the BIP-39 mnemonic itself, not a share. It belongs in a wallet.", None),
        ("Passphrase",
         "if one is set, it is deliberately NOT on this sheet. Note only where it lives.", None),
        ("After splitting",
         "verify every share, restore once as a test, then destroy this sheet or",
         "store it as securely as all the shares put together."),
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

    y -= h2 + 5 * mm
    hf = 13 * mm
    box(c, RAND, y - hf, NUTZ, hf, "If found, please contact:")

    c.setFont("Helvetica", 6.8)
    c.setFillColor(TXT_GRAU)
    c.drawRightString(W - RAND, y - hf - 3.2 * mm, "seedhodler.io  ·  form %s" % VERSION)


def blatt(c, woerter, logo):
    y = kopf(c, logo)
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
        shares = 33 if woerter == 24 else 20
        c.setTitle("Seedhodler Seed Form (%d words, splits into %d-word shares)"
                   % (woerter, shares))
        blatt(c, woerter, logo)
        c.save()
        txt = subprocess.run(["pdftotext", datei, "-"], capture_output=True, text=True).stdout
        dashes = [ch for ch in ("—", "–") if ch in txt]
        print("%-30s 1 Seite, %2d Woerter, Dashes: %s"
              % (datei, woerter, dashes if dashes else "keine"))


if __name__ == "__main__":
    main()
