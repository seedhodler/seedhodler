#!/usr/bin/env python3
"""Custody overview: which wallet is kept in which form at which place.

The most dangerous sheet in the file. It undoes the protection of splitting
if it falls into the wrong hands, and it is at the same time the only document
that describes the system as a whole. Landscape A4, a single copy. English only.
"""
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

from sh_brand import (BOX, BOX_KOPF, LINIE, RAND, TXT, TXT_GRAU, TXT_MITTEL,
                      WEISS, box, fusszeile, kopf, logo_laden, pruefen,
                      schreiblinie, warnbox)

DATEI = "CustodyOverview.pdf"
VERSION = "v1.0"
W, H = landscape(A4)
NUTZ = W - 2 * RAND

WALLETS = 8
ORTE = ["A", "B", "C", "D", "E"]


def tabelle(c, y):
    zh = 9.5 * mm
    b_wallet = 62 * mm
    b_typ = 30 * mm
    b_schwelle = 24 * mm
    b_ort = (NUTZ - b_wallet - b_typ - b_schwelle) / len(ORTE)
    spalten = ([("Wallet / label", b_wallet), ("Seed", b_typ),
                ("Threshold", b_schwelle)]
               + [("Place %s" % o, b_ort) for o in ORTE])

    # --- header row ------------------------------------------------------
    kh = 9 * mm
    c.setFillColor(BOX_KOPF)
    c.setStrokeColor(BOX_KOPF)
    c.roundRect(RAND, y - kh, NUTZ, kh, 1.6 * mm, stroke=0, fill=1)
    x = RAND
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(TXT)
    for label, b in spalten:
        if label.startswith("Place"):
            c.drawCentredString(x + b / 2, y - 5.8 * mm, label)
        else:
            c.drawString(x + 3 * mm, y - 5.8 * mm, label)
        x += b
    y -= kh

    # --- rows ------------------------------------------------------------
    for i in range(WALLETS):
        if i % 2 == 0:
            c.setFillColor(BOX)
            c.setStrokeColor(BOX)
            c.rect(RAND, y - zh, NUTZ, zh, stroke=0, fill=1)
        x = RAND
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(TXT_GRAU)
        c.drawString(x + 3 * mm, y - zh + 3.6 * mm, "%d" % (i + 1))
        for j, (_, b) in enumerate(spalten):
            if j:
                c.setStrokeColor(LINIE)
                c.setLineWidth(0.4)
                c.line(x, y - zh + 1.5 * mm, x, y - 1.5 * mm)
            links = 8 * mm if j == 0 else 3 * mm
            schreiblinie(c, x + links, y - zh + 3 * mm, b - links - 3 * mm)
            x += b
        y -= zh
    return y - 5 * mm


def legende(c, y):
    """Key as a single row, so the resolution box gets the full width."""
    x = RAND
    for k, text in [("M", "full seed"), ("T", "one share"),
                    ("P", "passphrase"), ("blank", "none of these")]:
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(TXT)
        c.drawString(x, y, k)
        x += c.stringWidth(k, "Helvetica-Bold", 8) + 2 * mm
        c.setFont("Helvetica", 8)
        c.setFillColor(TXT_MITTEL)
        c.drawString(x, y, text)
        x += c.stringWidth(text, "Helvetica", 8) + 7 * mm
    c.setFont("Helvetica-Oblique", 7.6)
    c.setFillColor(TXT_GRAU)
    c.drawString(x, y, "enter a code for each wallet and place")
    y -= 7 * mm

    h = 24 * mm
    box(c, RAND, y - h, NUTZ, h, "What the place codes mean")
    sp = (NUTZ - 6 * mm - 4 * 5 * mm) / len(ORTE)
    xx = RAND + 3 * mm
    for o in ORTE:
        c.setFont("Helvetica-Bold", 8.4)
        c.setFillColor(TXT)
        c.drawString(xx, y - 12 * mm, o)
        schreiblinie(c, xx + 5 * mm, y - 13 * mm, sp - 5 * mm)
        schreiblinie(c, xx + 5 * mm, y - 19.5 * mm, sp - 5 * mm)
        xx += sp + 5 * mm
    return y - h - 5 * mm


def blatt(c, logo):
    y = kopf(c, W, H, logo, "Custody overview",
             "Which wallet is kept in which form at which place")

    hb = 18 * mm
    box(c, RAND, y - hb, NUTZ * 0.3, hb, "As of:")
    schreiblinie(c, RAND + 3 * mm, y - hb + 4.5 * mm, NUTZ * 0.3 - 6 * mm)
    warnbox(c, RAND + NUTZ * 0.3 + 5 * mm, y, NUTZ * 0.7 - 5 * mm,
            "This sheet is the map of the whole system.",
            ["A single copy, in the safe. Do not scan, photograph or copy it.",
             "Destroy earlier versions once a new one is written."])
    y -= hb + 7 * mm

    y = tabelle(c, y)
    legende(c, y)

    fusszeile(c, W, "Custody overview %s" % VERSION)
    c.showPage()


def main():
    logo = logo_laden()
    c = canvas.Canvas(DATEI, pagesize=landscape(A4), invariant=1)
    c.setTitle("Seedhodler Custody Overview")
    blatt(c, logo)
    c.save()
    pruefen(DATEI)


if __name__ == "__main__":
    main()
