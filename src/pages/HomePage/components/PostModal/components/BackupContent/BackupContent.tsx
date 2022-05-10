import React, { useState } from "react"

import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { ShareHeader } from "components/ShareHeader"
import { TextPlace } from "components/TextPlace"
import { Button } from "components/Button"

import classes from "../../PostModal.module.scss"

type Props = {
  shares: string[]
  thresholdNumber: number
}

const BackupContent: React.FC<Props> = ({ shares, thresholdNumber }) => {
  const [currentShareId, setCurrentShareId] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isFirstStep) {
      setCurrentStep(prev => ++prev)
    } else {
      if (currentShareId + 1 < thresholdNumber) {
        setCurrentShareId(prev => ++prev)
        setCurrentStep(0)
      }
    }
  }

  const shareNumberInfo = (
    <p className={classes.shareNumberInfo}>
      {currentShareId + 1} / {thresholdNumber} Shares
    </p>
  )

  return (
    <div className={classes.modalContentContainer}>
      <div style={{ width: "100%" }}>
        <div className={classes.descriptionContainer}>
          {isFirstStep ? (
            <p className={classes.description}>
              Please carefully write down this phrase. <b>Keep it in a safe place!</b>
            </p>
          ) : (
            <p className={classes.description}>Lets verify your recovery phrase.</p>
          )}
          {!isFirstStep && shareNumberInfo}
        </div>
        <ShareHeader text={`Share - ${currentShareId + 1}`} style={{ marginBottom: "1.2rem" }} />
        <div className={classes.blockDivider}></div>
        <div className={classes.textPlacesContainer}>
          {shares[currentShareId].split(" ").map((word, index) => (
            <TextPlace
              key={index}
              count={index + 1}
              text={word}
              style={{ margin: "0 auto", width: "19%" }}
            />
          ))}
        </div>
        {isFirstStep && shareNumberInfo}
        <p className={classes.additionalInfo}>
          We will confirm your written recovery phrase on the next screen.
        </p>
      </div>
      <Button onClick={handleNext} iconRight={ArrowRightIcon}>
        Next
      </Button>
    </div>
  )
}

export default BackupContent
