import { PDFDocument } from "pdf-lib"
import Seedhodler12 from "assets/pdf/Seedhodler12.pdf"
import Seedhodler24 from "assets/pdf/Seedhodler24.pdf"
import Share12 from "assets/pdf/Share12.pdf"
import Share24 from "assets/pdf/Share24.pdf"

export const generatePdf = async () => {
  const mergedPdf = await PDFDocument.create()

  const seedhodler12bytes = await fetch(Seedhodler12).then(res => res.arrayBuffer())
  const share12bytes = await fetch(Share12).then(res => res.arrayBuffer())

  const seedhodler12pdf = await PDFDocument.load(seedhodler12bytes)
  const share12pdf = await PDFDocument.load(share12bytes)

  const copiedPagesA = await mergedPdf.copyPages(seedhodler12pdf, seedhodler12pdf.getPageIndices())
  copiedPagesA.forEach(page => mergedPdf.addPage(page))

  const copiedPagesB = await mergedPdf.copyPages(share12pdf, share12pdf.getPageIndices())
  copiedPagesB.forEach(page => mergedPdf.addPage(page))

  return mergedPdf.save()
}
