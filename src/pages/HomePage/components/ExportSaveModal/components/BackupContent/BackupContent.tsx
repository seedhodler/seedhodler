import React, { useState, Dispatch, SetStateAction } from "react"

import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import ArrowLeftIcon from "assets/icons/ArrowLeft.svg"
import { Button } from "components/Button"
import { ShareHeader } from "components/ShareHeader"
import { TextPlace } from "components/TextPlace"

import classes from "../../ExportSaveModal.module.scss"

type Props = {
  shares: string[]
  setCurrentStep: Dispatch<SetStateAction<number>>
  selectedWordCount: number
  sharesNumber: number
}

enum ActionEnum {
  Prev,
  Next,
}

const BackupContent: React.FC<Props> = ({ shares, setCurrentStep, selectedWordCount, sharesNumber }) => {
  const [shareId, setShareId] = useState(0)

  const handleNavigation = (type: ActionEnum) => {
    if (type === ActionEnum.Next) {
      if (shareId + 1 < sharesNumber) {
        setShareId(prev => ++prev)
      } else {
        setCurrentStep(prev => ++prev)
      }
    } else {
      if (shareId > 0) {
        setShareId(prev => --prev)
      }
    }
  }

  return (
    <div className={classes.modalContentContainer}>
      <div style={{ width: "100%" }}>
        <p className={classes.description}>
          Please carefully write down this phrase. <b>Keep it in a safe place!</b>
        </p>
        <ShareHeader text={`Share - ${shareId + 1}`} style={{ marginBottom: "1.2rem" }} />
        <div className={classes.blockDivider}></div>
        <div
          className={classes.textPlacesContainer}
          style={{ height: selectedWordCount === 12 ? "560px" : "960px", marginBottom: "1.6rem" }}
        >
          {shares[shareId].split(" ").map((word, index) => (
            <TextPlace
              key={index}
              count={index + 1}
              text={word}
              style={{
                marginBottom: "1.2rem",
                width: "49%",
                alignSelf: index <= (selectedWordCount === 12 ? 9 : 16) ? "flex-start" : "flex-end",
              }}
            />
          ))}
        </div>
        <p className={classes.shareNumberInfo}>
          {shareId + 1} / {sharesNumber} Shares
        </p>
        <p className={classes.additionalInfo} style={{ marginBottom: "2.4rem" }}>
          We will confirm your written recovery phrase on the next screen.
        </p>
        <div className={classes.blockDivider} style={{ marginBottom: "2.4rem" }}></div>
      </div>
      <div className={classes.buttonsContainer} style={{ width: "300px" }}>
        <Button
          onClick={() => handleNavigation(ActionEnum.Prev)}
          iconLeft={ArrowLeftIcon}
          disabled={shareId <= 0}
        >
          Prev
        </Button>
        <Button onClick={() => handleNavigation(ActionEnum.Next)} iconRight={ArrowRightIcon}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default BackupContent
