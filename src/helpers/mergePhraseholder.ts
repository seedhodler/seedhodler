import { PDFDocument } from "pdf-lib"

// The printable "Phraseholder": the seed form on page 1, then one share form per
// share, each on its own page. The v3.0 forms are one sheet each, so the whole
// job is copying pages, no compositing.
//
// Blank templates are copied verbatim: no secret is ever drawn into the PDF. The
// words are written by hand on the print-out, which is the point of the airgapped
// workflow. Kept pure over the raw form bytes so tools/check-phraseholder.mjs can
// pin the page count down without a browser.
export const mergePhraseholder = async (
  seedFormBytes: ArrayBuffer | Uint8Array,
  shareFormBytes: ArrayBuffer | Uint8Array,
  sharesNumber: number,
): Promise<Uint8Array> => {
  const out = await PDFDocument.create()

  const seedDoc = await PDFDocument.load(seedFormBytes)
  const [seedPage] = await out.copyPages(seedDoc, [0])
  out.addPage(seedPage)

  const shareDoc = await PDFDocument.load(shareFormBytes)
  for (let i = 0; i < sharesNumber; i++) {
    const [sharePage] = await out.copyPages(shareDoc, [0])
    out.addPage(sharePage)
  }

  return out.save()
}
