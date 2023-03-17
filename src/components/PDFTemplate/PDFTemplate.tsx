import React from "react"
import { Document, Page, Text, View, Svg, Path } from "@react-pdf/renderer"
import { headStyles, shareStyles } from "./styles.js"
import { SVGIcon } from "./SVGIcon"

type Props = {
  selectedWordCount: number
  mnemonic: string[]
  shares: string[]
}

const PDFTemplate: React.FC<Props> = ({ selectedWordCount, mnemonic, shares }) => {
  return (
    <Document>
      <Page size="A4" key="0" style={headStyles.pdfPage}>
        <View style={headStyles.contentContainer}>
          <View style={headStyles.contentHead}>
            <View style={headStyles.empty}></View>
            <SVGIcon />
            <View style={headStyles.additionalInfo}>
              <Text>BIP 39</Text>
            </View>
          </View>
          <View style={headStyles.innerDescription}>
            <Text>Use the Seedhodler Phraseholder to write down your generated phrases.</Text>
          </View>
          <View
            style={{
              ...headStyles.textPlacesContainer,
              height: selectedWordCount === 12 ? "360px" : "680px",
            }}
          >
            {mnemonic.map((word, index) => (
              <View
                key={index + 1}
                style={{
                  ...headStyles.textContent,
                  alignSelf: index <= (selectedWordCount === 12 ? 5 : 11) ? "flex-start" : "flex-end",
                }}
              >
                <View style={headStyles.idexContent}>
                  <Text> {`${index + 1}.`}</Text>
                </View>
                <Text>{word}&nbsp;</Text>
              </View>
            ))}
          </View>
          <View style={headStyles.finalInnerDescription}>
            <Text>{"etc.\n In seedhodler we trust."}</Text>
          </View>
        </View>
      </Page>
      {/* <SharePages sharesNumber={sharesNumber} shares={shares} /> */}
      {shares.map((share, index) => (
        <Page key={index + 1} size="A4">
          <View style={shareStyles.body}>
            <View key={index + 1} style={shareStyles.container}>
              <View style={shareStyles.box}>
                <View style={shareStyles.header}>
                  <View style={shareStyles.numberContainer} />
                  <Text style={shareStyles.numberHeader}>{`Share - ${index + 1}`}</Text>
                </View>
                <View style={shareStyles.blockDivider} />
                <View
                  style={{
                    ...shareStyles.itemsContainer,
                    height: selectedWordCount === 12 ? "650px" : "960px",
                  }}
                >
                  {share.split(" ").map((word, index) => (
                    <View
                      key={index + 1}
                      style={{
                        ...shareStyles.itemsColumn,
                        alignSelf:
                          index <= (selectedWordCount === 12 ? 9 : 16) ? "flex-start" : "flex-end",
                      }}
                    >
                      <View style={shareStyles.itemsInfo}>
                        <Text> {`${index + 1}.`}</Text>
                      </View>
                      <Text>{word}&nbsp;</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  )
}

export default PDFTemplate
