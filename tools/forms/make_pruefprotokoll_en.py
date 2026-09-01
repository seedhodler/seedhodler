#!/usr/bin/env python3
"""Verification log for the storage locations.

Catches slow decay: keepers who moved, broken seals, words gone unreadable.
Without a log, that surfaces only in an emergency, and then it is too late.
English only.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

from sh_brand import (BOX, BOX_KOPF, LINIE, RAND, TXT, TXT_GRAU, TXT_MITTEL,
                      box, fusszeile, kasten, kopf, logo_laden, pruefen,
                      schreiblinie, umbruch)

DATEI = "VerificationLog.pdf"
VERSION = "v1.0"
W, H = A4
NUTZ = W - 2 * RAND
ZEILEN = 15

# (two-line heading, width in mm, type)
SPALTEN = [
    (("Date", ""), 20, "linie"),
    (("Place /", "envelope"), 40, "linie"),
    (("Seal", "intact"), 19, "kasten"),
    (("Contents", "complete"), 19, "kasten"),
    (("Test", "done"), 19, "kasten"),
    (("Address", "matched"), 19, "kasten"),
    (("Re-", "sealed"), 20, "kasten"),
    (("Initials", ""), 28, "linie"),
]


def absatz(c, y, text, size=8.8, x=RAND, breite=NUTZ, durchschuss=4.6 * mm,
           font="Helvetica", farbe=TXT_MITTEL):
    c.setFont(font, size)
    c.setFillColor(farbe)
    for z in umbruch(c, text, breite, font, size):
        c.drawString(x, y, z)
        y -= durchschuss
    return y


def tabelle(c, y):
    kh = 12 * mm
    c.setFillColor(BOX_KOPF)
    c.setStrokeColor(BOX_KOPF)
    c.roundRect(RAND, y - kh, NUTZ, kh, 1.6 * mm, stroke=0, fill=1)

    x = RAND
    c.setFont("Helvetica-Bold", 7.4)
    c.setFillColor(TXT)
    for (z1, z2), b, _ in SPALTEN:
        mitte = x + b * mm / 2
        if z2:
            c.drawCentredString(mitte, y - 5.4 * mm, z1)
            c.drawCentredString(mitte, y - 9 * mm, z2)
        else:
            c.drawCentredString(mitte, y - 7.2 * mm, z1)
        x += b * mm
    y -= kh

    zh = 10 * mm
    for i in range(ZEILEN):
        if i % 2 == 0:
            c.setFillColor(BOX)
            c.setStrokeColor(BOX)
            c.rect(RAND, y - zh, NUTZ, zh, stroke=0, fill=1)
        x = RAND
        for j, (_, b, typ) in enumerate(SPALTEN):
            bb = b * mm
            if j:
                c.setStrokeColor(LINIE)
                c.setLineWidth(0.4)
                c.line(x, y - zh + 1.5 * mm, x, y - 1.5 * mm)
            if typ == "kasten":
                kasten(c, x + bb / 2 - 1.8 * mm, y - zh / 2 - 1.8 * mm, 3.6 * mm)
            else:
                schreiblinie(c, x + 3 * mm, y - zh + 3 * mm, bb - 6 * mm)
            x += bb
        y -= zh
    return y - 6 * mm


def blatt(c, logo):
    y = kopf(c, W, H, logo, "Verification log",
             "Once a year, and whenever a storage location changes")

    y = absatz(c, y,
               "Checked from the outside: seal intact, envelope at the agreed place, "
               "keeper reachable. The envelope stays closed. Once every few years the "
               "full test is worth it: bring enough shares together, restore the wallet, "
               "compare the check address, then write the words down again and re-seal.")
    y -= 4 * mm
    y = tabelle(c, y)

    h = 27 * mm
    box(c, RAND, y - h, NUTZ, h, "If a check fails")
    absatz(c, y - 11 * mm,
           "A broken seal or a missing envelope means this share must be treated as "
           "compromised. Making a new one at the same place does not help, because the "
           "old one stays valid. The right response is to split the seed again, write "
           "all shares anew, and destroy the old ones. If theft is suspected, move the "
           "funds to a freshly created wallet.",
           size=8.2, x=RAND + 3 * mm, breite=NUTZ - 6 * mm, durchschuss=4.2 * mm)

    fusszeile(c, W, "Verification log %s" % VERSION)
    c.showPage()


def main():
    logo = logo_laden()
    c = canvas.Canvas(DATEI, pagesize=A4, invariant=1)
    c.setTitle("Seedhodler Verification Log")
    blatt(c, logo)
    c.save()
    pruefen(DATEI)


if __name__ == "__main__":
    main()
