import { PDFDocument } from "pdf-lib"

// Merge blank form PDFs into one printable document: each form's page is copied
// `copies` times, in the given order. Blank templates are copied verbatim, no
// secret is ever drawn into the PDF; the words are written by hand on the
// print-out, which is the point of the airgapped workflow. Kept pure over the
// raw form bytes so tools/check-forms.mjs can pin the page count down without a
// browser.
export type FormItem = { bytes: ArrayBuffer | Uint8Array; copies: number }

export const mergeForms = async (items: FormItem[]): Promise<Uint8Array> => {
  const out = await PDFDocument.create()

  for (const item of items) {
    if (item.copies < 1) continue
    const doc = await PDFDocument.load(item.bytes)
    const indices = doc.getPageIndices() // copy every page, e.g. the 2-page guide
    for (let i = 0; i < item.copies; i++) {
      const pages = await out.copyPages(doc, indices)
      pages.forEach(page => out.addPage(page))
    }
  }

  return out.save()
}
