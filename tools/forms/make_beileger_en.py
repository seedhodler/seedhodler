#!/usr/bin/env python3
"""Beileger fuer die Verwahrungsorte, A5.

Kommt zu jedem versiegelten Umschlag, AUSSERHALB des Siegels.

Bewusst neutral: kein Logo, keine Domain, kein Hinweis auf die Anlageklasse.
Wer den Zettel findet, soll wissen, was zu tun ist, aber nicht, was zu
holen waere.

English only. One A5 slip per sealed envelope, kept outside the seal.
"""
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

DATEI = "CustodyInsert.pdf"

TXT = HexColor("#15171a")
TXT_2 = HexColor("#33383f")
LABEL = HexColor("#5f666e")
LINIE = HexColor("#8f959c")
RAHMEN = HexColor("#bcc1c6")

W, H = A5
RAND = 13 * mm
NUTZ = W - 2 * RAND
SERIF = "Times-Roman"
SERIF_B = "Times-Bold"
GROESSE = 10
DURCHSCHUSS = 4.9 * mm


def umbruch(c, text, breite, font, size):
    """Bricht Fliesstext auf die verfuegbare Breite um."""
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


def linie(c, x, y, b):
    c.setStrokeColor(LINIE)
    c.setLineWidth(0.9)
    c.line(x, y, x + b, y)


def feld(c, x, y, b, label):
    c.setFont("Helvetica-Bold", 7.5)
    c.setFillColor(LABEL)
    c.drawString(x, y + 2.8 * mm, label)
    linie(c, x, y, b)


def block(c, y, text, fett=False):
    font = SERIF_B if fett else SERIF
    c.setFont(font, GROESSE)
    c.setFillColor(TXT if fett else TXT_2)
    for z in umbruch(c, text, NUTZ, font, GROESSE):
        c.drawString(RAND, y, z)
        y -= DURCHSCHUSS
    return y


def seite(c, t):
    y = H - RAND

    c.setFont("Helvetica-Bold", 11.5)
    c.setFillColor(TXT)
    c.drawString(RAND, y - 5 * mm, t["titel"])
    c.setStrokeColor(TXT)
    c.setLineWidth(1.1)
    c.line(RAND, y - 8.5 * mm, W - RAND, y - 8.5 * mm)
    y -= 17 * mm

    b = (NUTZ - 6 * mm) / 2
    feld(c, RAND, y, b, t["kennung"])
    feld(c, RAND + b + 6 * mm, y, b, t["datum"])
    y -= 13 * mm

    y = block(c, y, t["anrede"])
    y -= 3 * mm

    for text, fett in t["bloecke"]:
        y = block(c, y, text, fett)
        y -= 3 * mm

    # --- Kontaktfelder ---------------------------------------------------
    y -= 2 * mm
    kasten_h = 4 * mm + len(t["kontakt"]) * 9.5 * mm
    c.setStrokeColor(RAHMEN)
    c.setLineWidth(0.9)
    c.rect(RAND - 3 * mm, y - kasten_h, NUTZ + 6 * mm, kasten_h)

    yy = y - 7 * mm
    for label in t["kontakt"]:
        feld(c, RAND, yy, NUTZ, label)
        yy -= 9.5 * mm

    y -= kasten_h + 9 * mm

    y = block(c, y, t["dank"])
    y -= 12 * mm

    linie(c, RAND, y, NUTZ * 0.66)
    c.setFont("Helvetica", 7.5)
    c.setFillColor(LABEL)
    c.drawString(RAND, y - 4 * mm, t["signatur"])

    c.showPage()


DE = {
    "titel": "Bitte aufbewahren, nicht öffnen",
    "kennung": "Kennung des Umschlags:",
    "datum": "Hinterlegt am:",
    "anrede": "An die Person, die diesen Umschlag findet oder verwahrt,",
    "bloecke": [
        ("dieser versiegelte Umschlag enthält einen Teil einer aufgeteilten Sicherung. "
         "Ein einzelner Teil ist für sich genommen wertlos. Er lässt sich weder verwenden "
         "noch zu Geld machen. Erst mehrere Teile von verschiedenen Orten ergeben "
         "zusammen etwas Nutzbares.", False),
        ("Bitte öffnen Sie den Umschlag nicht.", True),
        ("Das Siegel dient dem Nachweis, dass der Inhalt unberührt ist. Bewahren Sie ihn "
         "einfach dort auf, wo Sie ihn vorgefunden haben, trocken und vor Feuer geschützt.", False),
        ("Sollten Sie Fragen haben, den Umschlag nicht mehr verwahren können oder eine "
         "Veränderung am Siegel bemerken, wenden Sie sich bitte an:", False),
    ],
    "kontakt": ["Name", "Erreichbar unter", "Ersatzweise erreichbar über"],
    "dank": "Vielen Dank, dass Sie diesen Umschlag verwahren.",
    "signatur": "Ort, Datum, Unterschrift",
}

EN = {
    "titel": "Please keep this. Do not open.",
    "kennung": "Envelope reference:",
    "datum": "Deposited on:",
    "anrede": "To whoever finds or keeps this envelope,",
    "bloecke": [
        ("this sealed envelope holds one part of a split backup. A single part is worthless "
         "on its own. It cannot be used and it cannot be turned into money. Only several "
         "parts, held in different places, add up to anything usable.", False),
        ("Please do not open the envelope.", True),
        ("The seal is there to show that the contents are untouched. Simply keep it where "
         "you found it, dry and protected from fire.", False),
        ("If you have questions, can no longer keep the envelope, or notice any change to "
         "the seal, please get in touch with:", False),
    ],
    "kontakt": ["Name", "Reachable at", "Alternative contact"],
    "dank": "Thank you for keeping this envelope safe.",
    "signatur": "Place, date, signature",
}


def main():
    c = canvas.Canvas(DATEI, pagesize=A5, invariant=1)
    c.setTitle("Seedhodler Custody Insert")
    for t in (EN,):
        seite(c, t)
    c.save()

    import subprocess
    txt = subprocess.run(["pdftotext", DATEI, "-"], capture_output=True, text=True).stdout
    dashes = [ch for ch in ("—", "–") if ch in txt]
    verraeter = [w for w in ("Bitcoin", "Krypto", "crypto", "Seed", "seed", "Wallet",
                             "seedhodler", "Shamir", "SLIP", "Coin", "Börse") if w in txt]
    print("%s: 1 Seite A5 (EN)" % DATEI)
    print("Dashes:", dashes if dashes else "keine")
    print("verräterische Begriffe:", verraeter if verraeter else "keine")


if __name__ == "__main__":
    main()
