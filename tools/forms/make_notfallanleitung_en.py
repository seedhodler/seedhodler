#!/usr/bin/env python3
"""Emergency and inheritance guide.

The sheet without which the whole split is unsolvable for others. Two pages A4,
English. Only the details that can change stay handwritten: where the overview
is kept and who can help.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

from sh_brand import (BOX, GRUEN, LINIE, RAND, TXT, TXT_GRAU, TXT_MITTEL,
                      WEISS, box, fusszeile, kopf, logo_laden, pruefen,
                      schreiblinie, umbruch, warnbox)

DATEI = "EmergencyGuide.pdf"
VERSION = "v1.0"
W, H = A4
NUTZ = W - 2 * RAND


def absatz(c, y, text, size=9.2, font="Helvetica", farbe=TXT_MITTEL,
           x=RAND, breite=NUTZ, durchschuss=4.8 * mm):
    c.setFont(font, size)
    c.setFillColor(farbe)
    for z in umbruch(c, text, breite, font, size):
        c.drawString(x, y, z)
        y -= durchschuss
    return y


def schritt(c, y, nr, titel, text, feld=None):
    """Numbered step with a green circle."""
    r = 3.6 * mm
    c.setFillColor(GRUEN)
    c.circle(RAND + r, y + 1.3 * mm, r, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(WEISS)
    c.drawCentredString(RAND + r, y + 0.1 * mm, str(nr))

    tx = RAND + 10 * mm
    tb = NUTZ - 10 * mm
    c.setFont("Helvetica-Bold", 9.8)
    c.setFillColor(TXT)
    c.drawString(tx, y, titel)

    y = absatz(c, y - 5.4 * mm, text, x=tx, breite=tb, durchschuss=4.5 * mm)
    if feld:
        y += 0.5 * mm
        c.setFont("Helvetica-Bold", 7.6)
        c.setFillColor(TXT_GRAU)
        c.drawString(tx, y, feld)
        bb = c.stringWidth(feld, "Helvetica-Bold", 7.6)
        schreiblinie(c, tx + bb + 3 * mm, y, tb - bb - 3 * mm)
        y -= 5 * mm
    return y - 3.2 * mm


def seite1(c, logo):
    y = kopf(c, W, H, logo, "Emergency and inheritance guide",
             "What to do if I can no longer act")

    y = absatz(c, y,
               "My estate includes digital funds. They are not held at a bank and "
               "cannot be claimed through a court. Only whoever holds the matching "
               "words can access them. So that these words cannot be lost or stolen "
               "from a single place, I have split them and placed the parts in several "
               "locations. This guide walks you through the recovery.")
    y -= 3 * mm

    y = warnbox(c, RAND, y, NUTZ,
                "Take your time. Waiting costs nothing.",
                ["As long as the shares are spread out, no one can move the funds, not even you.",
                 "There is no reason to rush and no reason to show the words to strangers."])
    y -= 6 * mm

    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(TXT)
    c.drawString(RAND, y, "How to proceed")
    y -= 7 * mm

    y = schritt(c, y, 1, "Get an overview",
                "There is a custody overview. It lists which wallets exist, which of "
                "them are split, and at which places the envelopes are kept.",
                "It is kept:")

    y = schritt(c, y, 2, "Collect the envelopes",
                "A split wallet needs a minimum number of shares, usually three of "
                "five. Fewer is not enough, more does no harm. Do not open the "
                "envelopes until you have all the ones you need, and work in a place "
                "where you are undisturbed.")

    y = schritt(c, y, 3, "Combine the shares",
                "At seedhodler.io, ideally on a computer with no network connection. "
                "Enter the words of the shares there. The result is a sequence of 12 "
                "or 24 words, the seed itself.")

    y = schritt(c, y, 4, "Check the result",
                "Every form carries a check address. Restore the wallet and compare "
                "its first receiving address with it. If the two do not match, the "
                "result is wrong, even if it looks perfectly valid. In that case move "
                "nothing and get help.")

    y = schritt(c, y, 5, "Get access",
                "Enter the 12 or 24 words into a new hardware wallet. If the wallet "
                "has a passphrase, you also need it. Where it is kept is written on "
                "the wallet profile.")

    y -= 1 * mm
    h = 24 * mm
    box(c, RAND, y - h, NUTZ, h, "If seedhodler.io no longer exists")
    absatz(c, y - 10 * mm,
           "The split follows the open SLIP-0039 standard. Any library that "
           "implements it combines the shares. Watch the last step: there the result "
           "is not a seed but the BIP-39 entropy. It still has to be turned back into "
           "a BIP-39 mnemonic. A technically skilled person needs about an hour.",
           size=8.4, x=RAND + 3 * mm, breite=NUTZ - 6 * mm, durchschuss=4.2 * mm)

    y -= 29 * mm
    h2 = 20 * mm
    box(c, RAND, y - h2, NUTZ, h2, "Wallets that are not split")
    absatz(c, y - 10 * mm,
           "Not every wallet is split. For the rest, the full seed sits at a single "
           "place. Which ones these are is written in the custody overview. For them "
           "steps 2 and 3 fall away, and the words are entered directly.",
           size=8.4, x=RAND + 3 * mm, breite=NUTZ - 6 * mm, durchschuss=4.2 * mm)

    fusszeile(c, W, "Emergency and inheritance guide %s  ·  Page 1 of 2" % VERSION)
    c.showPage()


def seite2(c, logo):
    y = H - RAND - 6 * mm
    c.setFont("Helvetica-Bold", 11.5)
    c.setFillColor(TXT)
    c.drawString(RAND, y, "What you must never do")
    c.setStrokeColor(GRUEN)
    c.setLineWidth(1.6)
    c.line(RAND, y - 4 * mm, W - RAND, y - 4 * mm)
    y -= 12 * mm

    y = warnbox(c, RAND, y, NUTZ, "Four mistakes that cannot be undone",
                ["1.  Entering the words of a share into a hardware wallet. The device accepts them without",
                 "     an error and opens a different, empty wallet. The mistake surfaces only later.",
                 "2.  Photographing the words, typing them, putting them in a cloud, or into a chat window.",
                 "     Not even briefly and not just to check.",
                 "3.  Letting anyone push you to hurry, whoever it is.",
                 "4.  Bringing all envelopes together in one place for good. That removes the protection."])
    y -= 13 * mm

    h = 35 * mm
    box(c, RAND, y - h, NUTZ, h, "Terms")
    yy = y - 11 * mm
    begriffe = [
        ("Seed", "12 or 24 words. Whoever has them has the funds."),
        ("Share", "20 or 33 words. A fragment of a seed, worthless on its own."),
        ("Threshold", "how many shares are needed, for example 3 of 5."),
        ("Passphrase", "an extra, self-chosen word. Without it the same seed opens a "
                       "different, empty wallet."),
        ("Check address", "the wallet's first receiving address. The proof that the "
                          "recovery is correct."),
    ]
    for label, text in begriffe:
        c.setFont("Helvetica-Bold", 8.2)
        c.setFillColor(TXT_GRAU)
        c.drawString(RAND + 3 * mm, yy, label)
        yy = absatz(c, yy, text, size=8.4, x=RAND + 32 * mm,
                    breite=NUTZ - 35 * mm, durchschuss=4.2 * mm)
        yy -= 0.6 * mm
    y -= h + 13 * mm

    h3 = 37 * mm
    box(c, RAND, y - h3, NUTZ, h3, "Who can help with the technical side")
    yy = y - 14.5 * mm
    for label in ("Name", "Reachable at", "Relationship / how known"):
        c.setFont("Helvetica-Bold", 7.4)
        c.setFillColor(TXT_GRAU)
        c.drawString(RAND + 3 * mm, yy + 2.8 * mm, label)
        schreiblinie(c, RAND + 3 * mm, yy, NUTZ - 6 * mm)
        yy -= 9.5 * mm
    y -= h3 + 13 * mm

    h4 = 51 * mm
    box(c, RAND, y - h4, NUTZ, h4, "Notes by hand")
    yy = y - 14 * mm
    for _ in range(5):
        schreiblinie(c, RAND + 3 * mm, yy, NUTZ - 6 * mm)
        yy -= 8.5 * mm
    y -= h4 + 13 * mm

    schreiblinie(c, RAND, y, NUTZ * 0.55)
    c.setFont("Helvetica-Bold", 7.4)
    c.setFillColor(TXT_GRAU)
    c.drawString(RAND, y - 4.2 * mm, "Place, date, signature")

    fusszeile(c, W, "Emergency and inheritance guide %s  ·  Page 2 of 2" % VERSION)
    c.showPage()


def main():
    logo = logo_laden()
    c = canvas.Canvas(DATEI, pagesize=A4, invariant=1)
    c.setTitle("Seedhodler Emergency and Inheritance Guide")
    seite1(c, logo)
    seite2(c, logo)
    c.save()
    pruefen(DATEI)


if __name__ == "__main__":
    main()
