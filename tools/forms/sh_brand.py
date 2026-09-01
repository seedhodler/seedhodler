"""Gemeinsame Bausteine der Seedhodler-Vordrucke.

Farben, Boxen und Kopf sind identisch zu den Share- und Seed-Formularen,
damit die ganze Ablage wie ein Satz aussieht.
"""
from reportlab.graphics import renderPDF
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from svglib.svglib import svg2rlg

from pathlib import Path
LOGO = str(Path(__file__).with_name("Logo.svg"))

GRUEN = HexColor("#78bb58")
BADGE_BG = HexColor("#b5e5cb")
BADGE_TXT = HexColor("#0b7f4e")
BOX = HexColor("#e6e7ea")
BOX_KOPF = HexColor("#d8dade")
TXT = HexColor("#1a1d1f")
TXT_GRAU = HexColor("#5f666e")
TXT_MITTEL = HexColor("#24282e")
LINIE = HexColor("#9aa0a6")
WARN_BG = HexColor("#ffeee8")
WARN_LINE = HexColor("#fc4747")
WARN_TXT = HexColor("#b32b1f")
WEISS = HexColor("#ffffff")

RAND = 13 * mm


def logo_laden():
    return svg2rlg(LOGO)


def umbruch(c, text, breite, font, size):
    zeilen, aktuell = [], ""
    for wort in text.split():
        probe = (aktuell + " " + wort).strip()
        if c.stringWidth(probe, font, size) <= breite:
            aktuell = probe
        else:
            zeilen.append(aktuell)
            aktuell = wort
    if aktuell:
        zeilen.append(aktuell)
    return zeilen


def box(c, x, y, b, h, label=None, fill=BOX, r=2.2 * mm, label_size=8):
    c.setFillColor(fill)
    c.setStrokeColor(fill)
    c.roundRect(x, y, b, h, r, stroke=0, fill=1)
    if label:
        c.setFont("Helvetica-Bold", label_size)
        c.setFillColor(TXT_GRAU)
        c.drawString(x + 3 * mm, y + h - 5.2 * mm, label)


def schreiblinie(c, x, y, b, farbe=LINIE):
    c.setStrokeColor(farbe)
    c.setLineWidth(0.9)
    c.line(x, y, x + b, y)


def kasten(c, x, y, seite=3.2 * mm):
    """Ankreuzkaestchen."""
    c.setStrokeColor(LINIE)
    c.setFillColor(WEISS)
    c.setLineWidth(0.9)
    c.rect(x, y, seite, seite, stroke=1, fill=1)


def wahl(c, x, y, optionen, size=8):
    """Reihe von Ankreuzkaestchen mit Beschriftung, gibt Endbreite zurueck."""
    c.setFont("Helvetica", size)
    for o in optionen:
        kasten(c, x, y)
        c.setFillColor(TXT_MITTEL)
        c.drawString(x + 4.6 * mm, y + 0.3 * mm, o)
        x += 4.6 * mm + c.stringWidth(o, "Helvetica", size) + 6 * mm
    return x


def kopf(c, W, H, logo, titel, unterzeile, badge=None):
    y = H - RAND
    ziel_b = 42 * mm
    s = ziel_b / logo.width
    logo.scale(s, s)
    logo.width *= s
    logo.height *= s
    renderPDF.draw(logo, c, (W - ziel_b) / 2, y - 13 * mm)
    logo.scale(1 / s, 1 / s)
    logo.width /= s
    logo.height /= s

    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(TXT)
    c.drawCentredString(W / 2, y - 20 * mm, titel)

    if unterzeile:
        c.setFont("Helvetica", 9)
        c.setFillColor(TXT_GRAU)
        c.drawCentredString(W / 2, y - 25.5 * mm, unterzeile)
        y -= 5.5 * mm

    c.setStrokeColor(GRUEN)
    c.setLineWidth(1.6)
    c.line(RAND, y - 24 * mm, W - RAND, y - 24 * mm)
    return y - 30 * mm


def warnbox(c, x, y, b, fett, zeilen, size=8.4):
    h = 10 * mm + len(zeilen) * 4.2 * mm
    c.setFillColor(WARN_BG)
    c.setStrokeColor(WARN_LINE)
    c.setLineWidth(1)
    c.roundRect(x, y - h, b, h, 2.2 * mm, stroke=1, fill=1)

    c.setFont("Helvetica-Bold", 9.8)
    c.setFillColor(WARN_TXT)
    c.drawString(x + 4 * mm, y - 5.8 * mm, fett)
    c.setFont("Helvetica", size)
    c.setFillColor(TXT_MITTEL)
    yy = y - 11 * mm
    for z in zeilen:
        c.drawString(x + 4 * mm, yy, z)
        yy -= 4.2 * mm
    return y - h


def badge(c, x, y, text, bg=BADGE_BG, fg=BADGE_TXT, size=8.6):
    b = c.stringWidth(text, "Helvetica-Bold", size) + 7 * mm
    c.setFillColor(bg)
    c.roundRect(x, y - 2.2 * mm, b, 7 * mm, 1.8 * mm, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", size)
    c.setFillColor(fg)
    c.drawCentredString(x + b / 2, y + 0.2 * mm, text)
    return b


def fusszeile(c, W, text):
    c.setFont("Helvetica", 6.8)
    c.setFillColor(TXT_GRAU)
    c.drawRightString(W - RAND, RAND - 2 * mm, text)


def pruefen(datei):
    import subprocess
    txt = subprocess.run(["pdftotext", datei, "-"],
                         capture_output=True, text=True).stdout
    dashes = [ch for ch in ("—", "–") if ch in txt]
    seiten = txt.count("\f")
    print("%-38s %d Seiten, Dashes: %s"
          % (datei, seiten, dashes if dashes else "keine"))
