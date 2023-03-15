import React from "react"
import { Document, Page, Text, View, Image } from "@react-pdf/renderer"
import LogoIcon from "assets/icons/Logo.png"

type Props = {
  selectedWordCount: number
  mnemonic: string[]
}

const PDFTemplate: React.FC<Props> = ({ selectedWordCount, mnemonic }) => {
  return (
    <Document>
      <Page>
        <View
          style={{
            border: "2px dashed #6f767e",
            borderRadius: "8px",
            marginBottom: "28.8px",
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              flexDirection: "row",
              width: "500px",
            }}
          >
            <View style={{ width: "60px" }} />
            <Image
              src={LogoIcon}
              style={{
                width: "200px",
                margin: "0 auto",
              }}
            />
            <Text
              style={{
                fontSize: "14px",
                lineHeight: "24px",
                padding: "2px 8px",
                backgroundColor: "#D0F1DC",
                borderRadius: "4px",
              }}
            >
              BIP 39
            </Text>
          </View>
          <Text
            style={{
              fontWeight: "light",
              fontSize: "20px",
              textAlign: "center",
              color: "#000",
              marginBottom: "89.6px",
            }}
          >
            Use the Seedhodler Phraseholder to write down your generated phrases.
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              height: selectedWordCount === 12 ? "360px" : "680px",
            }}
          >
            {mnemonic.map((word, index) => (
              <View
                key={index}
                style={{
                  width: "48%",
                  alignSelf: index <= (selectedWordCount === 12 ? 5 : 11) ? "flex-start" : "flex-end",
                }}
              >
                <Text
                  style={{
                    left: "0",
                    width: "67.2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6f767e",
                  }}
                >
                  {word}
                </Text>
              </View>
            ))}
          </View>
          <Text
            style={{
              fontWeight: "light",
              fontSize: "20px",
              textAlign: "center",
              color: "#000",
              marginBottom: "89.6px",
            }}
          >
            etc.
            <br />
            In seedhodler we trust.
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default PDFTemplate
