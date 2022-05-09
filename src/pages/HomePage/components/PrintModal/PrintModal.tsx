import React, { Dispatch, SetStateAction } from "react"

// @ts-ignore
import phrase12pdf from "assets/pdf/Seedhodler12.pdf"
// @ts-ignore
import phrase24pdf from "assets/pdf/Seedhodler24.pdf"
import LogoIcon from "assets/icons/Logo.svg"
import PrintIcon from "assets/icons/Print.svg"
import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { AdditionalInfo } from "components/AdditionalInfo"
import { Button } from "components/Button"
import { Modal } from "components/Modal"
import { TextPlace } from "components/TextPlace"
import { ButtonColorsEnum } from "constants/index"

import classes from "./PrintModal.module.scss"

type Props = {
  isPrintModalActive: boolean
  setIsPrintModalActive: Dispatch<SetStateAction<boolean>>
  selectedWordCount: number
  mnemonic: string[]
}

const PrintModal: React.FC<Props> = ({
  isPrintModalActive,
  setIsPrintModalActive,
  selectedWordCount,
  mnemonic,
}) => {
  return (
    <Modal
      title="Print - Seedhodler Phraseholder"
      isActive={isPrintModalActive}
      setIsActive={setIsPrintModalActive}
    >
      <>
        <p className={classes.description}>
          Before continuing please either print the provided Seedhodler Phraseholder or use pen and paper
          to write down your generated phrases.
        </p>
        <div className={classes.contentContainer}>
          <div className={classes.headerContainer}>
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
            onClick={() => {
              const docWindow = window.open(
                selectedWordCount === 12 ? phrase12pdf : phrase24pdf,
                "PRINT",
                "height=720,width=1280",
              )
              docWindow?.focus()
              docWindow?.print()
            }}
            iconRight={PrintIcon}
            color={ButtonColorsEnum.ErrorLightish}
          >
            Print
          </Button>
          <Button onClick={() => {}} iconRight={ArrowRightIcon}>
            Continue
          </Button>
        </div>
      </>
    </Modal>
  )
}

export default PrintModal
