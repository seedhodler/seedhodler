import { PDFDocument } from "pdf-lib"
// @ts-ignore
import Seedhodler12 from "assets/pdf/Seedhodler12.pdf"
// @ts-ignore
import Seedhodler24 from "assets/pdf/Seedhodler24.pdf"
// @ts-ignore
import Share12 from "assets/pdf/Share12.pdf"
// @ts-ignore
import Share24 from "assets/pdf/Share24.pdf"

export const generatePdf = async () => {
  const mergedPdf = await PDFDocument.create()

  const seedhodler12pdf = await PDFDocument.load(Seedhodler12)
  const share12pdf = await PDFDocument.load(Share12)

  const copiedPagesA = await mergedPdf.copyPages(seedhodler12pdf, seedhodler12pdf.getPageIndices())
  copiedPagesA.forEach(page => mergedPdf.addPage(page))

  const copiedPagesB = await mergedPdf.copyPages(share12pdf, share12pdf.getPageIndices())
  copiedPagesB.forEach(page => mergedPdf.addPage(page))

  const result = await mergedPdf.save()
  console.log(result)
}
