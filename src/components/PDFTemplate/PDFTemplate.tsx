import React from "react"
import { Document, Page, Image } from "@react-pdf/renderer"

import Share33_2 from "assets/pdf/Share33-2.png"
import Share33_1 from "assets/pdf/Share33-1.png"
import Share20_2 from "assets/pdf/Share20-2.png"
import Share20_1 from "assets/pdf/Share20-1.png"

import Seedhodler12_2 from "assets/pdf/Seedhodler12-2.png"
import Seedhodler24_2 from "assets/pdf/Seedhodler24-2.png"

type Props = {
  selectedWordCount: number
  sharesNumber: number
}

const PDFTemplate: React.FC<Props> = ({ selectedWordCount, sharesNumber }) => {
  const sharePages: Array<JSX.Element> = []
  const shareTemplate = selectedWordCount === 12 ? Share20_2 : Share33_2
  if (sharesNumber > 1) {
    const count = (sharesNumber - 2) / 2
    for (let index = 0; index < count; index++) sharePages.push(<Image src={shareTemplate} />)
    if (sharesNumber % 2 === 0)
      sharePages.push(<Image src={selectedWordCount === 12 ? Share20_1 : Share33_1} />)
  }
  return (
    <Document>
      <Page orientation="landscape" size="A4" key="0">
        <Image src={selectedWordCount === 12 ? Seedhodler12_2 : Seedhodler24_2} />
      </Page>
      {sharesNumber > 1 && (
        <Page orientation="landscape" size="A4">
          {sharePages}
        </Page>
      )}
    </Document>
  )
}

export default PDFTemplate
