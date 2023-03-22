import React from "react"
import { Document, Page, Image } from "@react-pdf/renderer"
import { headStyles } from "./styles.js"

import Share20 from "assets/pdf/Share20.png"
import Share33 from "assets/pdf/Share33.png"
import Seedhodler12 from "assets/pdf/Seedhodler12.png"
import Seedhodler24 from "assets/pdf/Seedhodler24.png"

type Props = {
  selectedWordCount: number
  sharesNumber: number
}

const PDFTemplate: React.FC<Props> = ({ selectedWordCount, sharesNumber }) => {
  const sharePages: Array<JSX.Element> = []
  const shareTemplate = selectedWordCount === 12 ? Share20 : Share33
  for (let index = 0; index < sharesNumber; index++) sharePages.push(<Image src={shareTemplate} />)
  return (
    <Document>
      <Page size="A4" key="0" style={headStyles.pdfPage}>
        <Image src={selectedWordCount === 12 ? Seedhodler12 : Seedhodler24} />
      </Page>
      <Page size="A4">{sharePages}</Page>
    </Document>
  )
}

export default PDFTemplate
