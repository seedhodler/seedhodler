import React, { Dispatch, SetStateAction } from "react"

import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import ArrowLeftIcon from "assets/icons/ArrowLeft.svg"
import { Button } from "components/Button"
import { ShareHeader } from "components/ShareHeader"
import { TextPlace } from "components/TextPlace"
import { NavigationEnum } from "constants/"

import classes from "../../ExportSaveModal.module.scss"

type Props = {
  shares: string[]
  setCurrentStep: Dispatch<SetStateAction<number>>
  selectedWordCount: number
  sharesNumber: number
  shareId: number
  setShareId: Dispatch<SetStateAction<number>>
}

const BackupContent: React.FC<Props> = ({
  shares,
  setCurrentStep,
  selectedWordCount,
  sharesNumber,
  shareId,
  setShareId,
}) => {
  const isNotLastShare = shareId + 1 < sharesNumber

  const handleNavigation = (type: NavigationEnum) => {
    if (type === NavigationEnum.Next) {
      if (isNotLastShare) {
        setShareId(prev => ++prev)
      } else {
        setCurrentStep(prev => ++prev)
      }
    } else {
      if (shareId > 0) {
        setShareId(prev => --prev)
      } else {
        setCurrentStep(prev => --prev)
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
        {!isNotLastShare && (
          <p className={classes.additionalInfo} style={{ marginBottom: "2.4rem" }}>
            We will confirm your written recovery phrase on the next screen.
          </p>
        )}
        <div className={classes.blockDivider} style={{ marginBottom: "2.4rem" }}></div>
      </div>
      <div className={classes.buttonsContainer}>
        <Button onClick={() => handleNavigation(NavigationEnum.Prev)} iconLeft={ArrowLeftIcon}>
          Back
        </Button>
        <Button onClick={() => handleNavigation(NavigationEnum.Next)} iconRight={ArrowRightIcon}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default BackupContent
