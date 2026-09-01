/**
 * Pin down the printable forms assembly.
 *
 *   npx vite-node tools/check-forms.mjs
 *
 * mergeForms copies the v3.0 form PDFs into one document: here the seed form,
 * then one share form per share, each on its own page (the same shape the print
 * dialog produces when both matching forms are selected). The user prints this and
 * writes the words by hand, so the one thing that must never regress is the page
 * count and that the right forms are used for the scheme. A silent bug (all
 * shares on one page, a missing sheet) means a backup that cannot be written.
 *
 * Checked against pdf-lib reading the produced document back: page count must be
 * exactly 1 + sharesNumber, and each copied page must keep its source size.
 */
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { PDFDocument } from "pdf-lib"

import { mergeForms } from "../src/helpers/mergeForms.ts"

const asset = name => fileURLToPath(new URL(`../src/assets/pdf/${name}`, import.meta.url))

const failures = []
let checks = 0
const check = (ok, message) => {
  checks += 1
  if (!ok) failures.push(message)
}

const round = n => Math.round(n * 100) / 100

const schemes = [
  { label: "12-word SLIP-39", seed: "SeedForm12.pdf", share: "ShareForm20.pdf" },
  { label: "24-word SLIP-39", seed: "SeedForm24.pdf", share: "ShareForm33.pdf" },
  { label: "12-word SSKR", seed: "SeedForm12.pdf", share: "ShareForm25.pdf" },
  { label: "24-word SSKR", seed: "SeedForm24.pdf", share: "ShareForm41.pdf" },
]

for (const scheme of schemes) {
  const seedBytes = await readFile(asset(scheme.seed))
  const shareBytes = await readFile(asset(scheme.share))

  // Sizes of the source forms, to prove the copied pages are not rescaled.
  const seedSize = (await PDFDocument.load(seedBytes)).getPage(0).getSize()
  const shareSize = (await PDFDocument.load(shareBytes)).getPage(0).getSize()

  for (const sharesNumber of [1, 2, 3, 5, 8]) {
    const merged = await mergeForms([
      { bytes: seedBytes, copies: 1 },
      { bytes: shareBytes, copies: sharesNumber },
    ])
    const out = await PDFDocument.load(merged)

    check(
      out.getPageCount() === 1 + sharesNumber,
      `${scheme.label}, ${sharesNumber} shares: page count ${out.getPageCount()}, want ${1 + sharesNumber}`,
    )

    const p0 = out.getPage(0).getSize()
    check(
      round(p0.width) === round(seedSize.width) && round(p0.height) === round(seedSize.height),
      `${scheme.label}: page 1 size ${round(p0.width)}x${round(p0.height)}, want seed ${round(seedSize.width)}x${round(seedSize.height)}`,
    )

    const pLast = out.getPage(out.getPageCount() - 1).getSize()
    check(
      round(pLast.width) === round(shareSize.width) && round(pLast.height) === round(shareSize.height),
      `${scheme.label}: share page size ${round(pLast.width)}x${round(pLast.height)}, want share ${round(shareSize.width)}x${round(shareSize.height)}`,
    )
  }
}

// The custody insert is an optional A5 add-on the picker appends after the
// forms, one per envelope. Prove it is a single A5 page and that a mixed
// selection assembles in order with the right per-page sizes.
{
  const insertBytes = await readFile(asset("CustodyInsert.pdf"))
  const insertSize = (await PDFDocument.load(insertBytes)).getPage(0).getSize()
  // A5 portrait is ~420x595 pts, and smaller than the A4 forms (595x842).
  check(Math.round(insertSize.width) === 420 && Math.round(insertSize.height) === 595, `custody insert is not A5: ${round(insertSize.width)}x${round(insertSize.height)}`) // prettier-ignore

  const seedBytes = await readFile(asset("SeedForm12.pdf"))
  const shareBytes = await readFile(asset("ShareForm25.pdf"))
  const merged = await mergeForms([
    { bytes: seedBytes, copies: 1 },
    { bytes: shareBytes, copies: 3 },
    { bytes: insertBytes, copies: 3 },
  ])
  const out = await PDFDocument.load(merged)
  check(out.getPageCount() === 7, `mixed selection: ${out.getPageCount()} pages, want 7`)
  const last = out.getPage(6).getSize()
  check(
    round(last.width) === round(insertSize.width) && round(last.height) === round(insertSize.height),
    `mixed selection: last page ${round(last.width)}x${round(last.height)}, want the A5 insert`,
  )

  // The emergency guide is two pages, so mergeForms must copy every page of a
  // source, not just the first; otherwise the heir gets half the guide.
  const guideBytes = await readFile(asset("EmergencyGuide.pdf"))
  check((await PDFDocument.load(guideBytes)).getPageCount() === 2, "emergency guide is not 2 pages")
  const guideOut = await PDFDocument.load(await mergeForms([{ bytes: guideBytes, copies: 2 }]))
  check(guideOut.getPageCount() === 4, `two copies of the 2-page guide: ${guideOut.getPageCount()} pages, want 4`) // prettier-ignore
}

if (failures.length) {
  console.error(`FAIL: ${failures.length} of ${checks} checks failed:`)
  for (const f of failures) console.error("  - " + f)
  process.exit(1)
}
console.log(`OK: ${checks} checks passed, forms assemble into the right pages`)
