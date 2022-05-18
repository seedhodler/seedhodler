import React, { useState, Dispatch, SetStateAction } from "react"

// import phrase12pdf from "assets/pdf/Seedhodler12.pdf"
// import phrase24pdf from "assets/pdf/Seedhodler24.pdf"
import LogoIcon from "assets/icons/Logo.svg"
import PrintIcon from "assets/icons/Print.svg"
import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { AdditionalInfo } from "components/AdditionalInfo"
import { Button } from "components/Button"
import { TextPlace } from "components/TextPlace"
import { ButtonColorsEnum } from "constants/index"
import { blobToSaveAs, generatePdf } from "helpers"

import classes from "../../ExportSaveModal.module.scss"
import { Loader } from "components/Loader"

type Props = {
  selectedWordCount: number
  mnemonic: string[]
  setCurrentStep: Dispatch<SetStateAction<number>>
  sharesNumber: number
}

const PrintContent: React.FC<Props> = ({
  selectedWordCount,
  mnemonic,
  setCurrentStep,
  sharesNumber,
}) => {
  const [isCreatingPdf, setIsCreatingPdf] = useState(false)

  const handlePrint = async () => {
    setIsCreatingPdf(true)
    const pdfBytes = await generatePdf(+selectedWordCount, sharesNumber)
    const blob = new Blob([pdfBytes], { type: "application/pdf" })
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
          <div style={{ width: "60px" }}></div>
          <img src={LogoIcon} alt="Logo" />
          <AdditionalInfo info="BIP 39" />
        </div>
        <p className={classes.innerDescription}>
          Use the Seedhodler Phraseholder to write down your generated phrases.
        </p>
        <div
          className={classes.textPlacesContainer}
          style={{ height: selectedWordCount === 12 ? "360px" : "680px" }}
        >
          {mnemonic.map((_, index) => (
            <TextPlace
              key={index}
              text=""
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
