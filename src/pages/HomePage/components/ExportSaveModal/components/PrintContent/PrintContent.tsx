import React, { useState, Dispatch, SetStateAction } from "react"

import LogoIcon from "assets/icons/Logo.svg"
import PrintIcon from "assets/icons/Print.svg"
import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { AdditionalInfo } from "components/AdditionalInfo"
import { Button } from "components/Button"
import { TextPlace } from "components/TextPlace"
import { ButtonColorsEnum } from "constants/index"

import classes from "../../ExportSaveModal.module.scss"
import { PDFTemplate } from "components/PDFTemplate"
import { pdf } from "@react-pdf/renderer"

type Props = {
  selectedWordCount: number
  mnemonic: string[]
  setCurrentStep: Dispatch<SetStateAction<number>>
  shares: string[]
}

const PrintContent: React.FC<Props> = ({ selectedWordCount, mnemonic, setCurrentStep, shares }) => {
  const [isCreatingPdf, setIsCreatingPdf] = useState(false)

  const handlePrint = async () => {
    setIsCreatingPdf(true)
    const blob = await pdf(
      <PDFTemplate selectedWordCount={selectedWordCount} mnemonic={mnemonic} shares={shares} />,
    ).toBlob()

    const fileUrl = URL.createObjectURL(blob)
    const docWindow = window.open(fileUrl, "PRINT", "height=720,width=1280")
    docWindow?.focus()
    docWindow?.print()
    setIsCreatingPdf(false)
  }

  return (
    <>
      <p className={classes.description}>
        Before continuing please either print the provided Seedhodler Phraseholder or use pen and paper
        to write down your generated phrases.
      </p>
      <div className={classes.contentContainer}>
        <div className={classes.logoContainer}>
          <div style={{ width: "60px" }} className={classes.whitespace}></div>
          <img src={LogoIcon} alt="Logo" className={classes.logo} />
          <AdditionalInfo info="BIP 39" className={classes.additionalInfo} />
        </div>
        <p className={classes.innerDescription}>
          Use the Seedhodler Phraseholder to write down your generated phrases.
        </p>
        <div
          className={classes.textPlacesContainer}
          style={{ height: selectedWordCount === 12 ? "360px" : "680px" }}
        >
          {mnemonic.map((word, index) => (
            <TextPlace
              key={index}
              text={word}
              count={index + 1}
              style={{
                width: "48%",
                alignSelf: index <= (selectedWordCount === 12 ? 5 : 11) ? "flex-start" : "flex-end",
              }}
            />
          ))}
        </div>
        <p className={classes.innerDescription} style={{ marginBottom: 0 }}>
          etc.
          <br /> In seedhodler we trust.
        </p>
      </div>
      <div className={classes.buttonsContainer}>
        <Button
          onClick={handlePrint}
          isLoading={isCreatingPdf}
          disabled={isCreatingPdf}
          iconRight={PrintIcon}
          color={ButtonColorsEnum.ErrorLightish}
        >
          {!isCreatingPdf ? "Print" : "Printing..."}
        </Button>
        <Button onClick={() => setCurrentStep(prev => ++prev)} iconRight={ArrowRightIcon}>
          Continue
        </Button>
      </div>
    </>
  )
}

export default PrintContent
