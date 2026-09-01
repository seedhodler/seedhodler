# Print forms

The printable backup forms are assembled at runtime from blank form PDFs bundled
in `src/assets/pdf/` (see `src/helpers/forms.ts`). This directory holds the
generator that produces those PDFs, so the assets are reproducible rather than
opaque binaries.

The forms are vector PDFs drawn with [reportlab]; the Seedhodler logo is embedded
from `Logo.svg` via svglib. No secret is ever drawn into a form: they are blank
templates, the words are written by hand on the print-out. That is the point of
the airgapped workflow, so keep it that way.

## Forms

| Script | Output | Scheme |
| --- | --- | --- |
| `make_seed_forms.py` | `SeedForm12.pdf`, `SeedForm24.pdf` | BIP-39 seed (both schemes) |
| `make_shard_forms_en.py` | `ShareForm20.pdf`, `ShareForm33.pdf` | SLIP-0039 shares (20/33 words) |
| `make_sskr_forms.py` | `ShareForm25.pdf`, `ShareForm41.pdf` | SSKR shares (25/41 bytewords) |
| `make_beileger_en.py` | `CustodyInsert.pdf` | custody insert, A5, English only |
| `make_steckbrief_en.py` | `WalletProfile.pdf` | wallet profile, English only |
| `make_pruefprotokoll_en.py` | `VerificationLog.pdf` | verification log, English only |
| `make_uebersicht_en.py` | `CustodyOverview.pdf` | custody overview, A4 landscape, English only |
| `make_notfallanleitung_en.py` | `EmergencyGuide.pdf` | emergency and inheritance guide, 2 pages, English only |

The seed form is the same for both schemes (a 12/24-word BIP-39 seed). Only the
share form is scheme-specific: SLIP-39 word shares vs SSKR bytewords, with the
matching badge, cross-use warning and recovery notes. `make_sskr_forms.py`
reuses the layout of `make_shard_forms_en.py` and only overrides that text, so
the two schemes' forms stay visually identical apart from the labelling.

The custody documents fill out the airgapped setup: a neutral envelope insert,
a wallet profile, a verification log, a custody overview, and an emergency and
inheritance guide. They share `sh_brand.py` (colors, header, boxes) so the whole
set looks like the forms. All are the English builds of German originals from
the forms host; the app is English, so only the English versions ship here (the
custody insert renders just the English page of a bilingual original, the rest
are straight translations). The insert is deliberately neutral: no logo, no
domain, no hint at the asset class, so a finder knows what to do but not what is
worth taking.

## Regenerate

Pinned versions (the exact ones the committed PDFs were built with) are in
`requirements.txt`.

```sh
cd tools/forms
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/python make_seed_forms.py
./venv/bin/python make_shard_forms_en.py
./venv/bin/python make_sskr_forms.py
./venv/bin/python make_beileger_en.py
./venv/bin/python make_steckbrief_en.py
./venv/bin/python make_pruefprotokoll_en.py
./venv/bin/python make_uebersicht_en.py
./venv/bin/python make_notfallanleitung_en.py
# then copy the produced *.pdf into ../../src/assets/pdf/
```

`pdftotext` (poppler) is used only for a post-build sanity print (word count, and
a guard that no em/en dashes crept in). It must be installed (`poppler-utils`);
without it the scripts still write the PDF but report an error instead of the
"Dashes: keine" line.

## Reproducibility

`make_sskr_forms.py` builds with reportlab's `invariant=1`, so it pins the date
and document id and two runs produce byte-identical PDFs: the committed
`ShareForm25.pdf` / `ShareForm41.pdf` are reproducible from this script (verify
with `sha256sum`). The upstream `make_seed_forms.py` and `make_shard_forms_en.py`
do not set `invariant` yet, so their committed PDFs carry the build timestamp
they were generated with; regenerating them deterministically is a small pending
cleanup. Reportlab otherwise draws deterministically, so apart from `/CreationDate`,
`/ModDate` and `/ID` two runs are identical.

[reportlab]: https://pypi.org/project/reportlab/
