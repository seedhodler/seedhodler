import { PDFDocument } from "pdf-lib"
import Seedhodler12 from "assets/pdf/Seedhodler12.pdf"
import Seedhodler24 from "assets/pdf/Seedhodler24.pdf"
import Share12 from "assets/pdf/Share12.pdf"
import Share24 from "assets/pdf/Share24.pdf"

export const generatePdf = async (wordCount: number, sharesNumber: number) => {
  const is12wordMnemonic = wordCount === 12
  const mergedPdf = await PDFDocument.create()

  const mnemonicBytes = await fetch(is12wordMnemonic ? Seedhodler12 : Seedhodler24).then(res =>
    res.arrayBuffer(),
  )
  const shareBytes = await fetch(is12wordMnemonic ? Share12 : Share24).then(res => res.arrayBuffer())

  const mnemonicPdf = await PDFDocument.load(mnemonicBytes)
  const sharePdf = await PDFDocument.load(shareBytes)

  const copiedPagesA = await mergedPdf.copyPages(mnemonicPdf, mnemonicPdf.getPageIndices())
  copiedPagesA.forEach(page => mergedPdf.addPage(page))

  const copiedPagesB = await mergedPdf.copyPages(sharePdf, sharePdf.getPageIndices())
  for (let i = 0; i < sharesNumber; i++) {
    mergedPdf.addPage(copiedPagesB[0])
  }

  return mergedPdf.save()
}

export const blobToSaveAs = (fileName: string, blob: Blob) => {
  try {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    // feature detection
    if (link.download !== undefined) {
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } catch (e) {
    console.error("BlobToSaveAs error", e)
  }
}
