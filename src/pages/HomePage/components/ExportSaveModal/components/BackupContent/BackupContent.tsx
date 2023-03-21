import React, { useEffect, useRef, Dispatch, SetStateAction } from "react"

import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import ArrowLeftIcon from "assets/icons/ArrowLeft.svg"
import LogoIcon from "assets/icons/Logo.svg"

import { Button } from "components/Button"
import { ShareHeader } from "components/ShareHeader"
import { TextPlace } from "components/TextPlace"
import { NavigationEnum } from "constants/"

import classes from "../../ExportSaveModal.module.scss"
import { InputWrapper } from "components/InputWrapper"
import { AdditionalInfo } from "components/AdditionalInfo"

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
  const descRef = useRef() as React.MutableRefObject<HTMLParagraphElement>

  useEffect(() => {
    descRef.current.scrollIntoView({ behavior: "smooth" })
  }, [shareId])

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
        <p className={classes.description} ref={descRef}>
          Time to write down the seed splits. We will verify them later.
        </p>
        <ShareHeader text={`Share - ${shareId + 1}`} style={{ marginBottom: "1.2rem" }} />
        <div className={classes.blockDivider}></div>
        <div className={classes.logoContainer}>
          <div style={{ width: "60px" }} className={classes.whitespace}></div>
          <img src={LogoIcon} alt="Logo" className={classes.logo} />
          <div style={{ width: "60px" }} className={classes.whitespace}></div>
        </div>
        <p className={classes.innerDescription}>
          Use the Seedhodler Phraseholder to write down your generated phrases.
        </p>
        <InputWrapper
          style={{
            marginBottom: "1.2rem",
            width: selectedWordCount === 12 ? "49%" : "48%",
          }}
        >
          <>
            <div className={classes.titleBox}>
              <p className={classes.titleInfo}>Seed Phrase</p>
              <AdditionalInfo info="BIP 39" className={classes.additionalInfo} />
            </div>
            <div
              className={classes.textPlacesContainer}
              style={{ height: selectedWordCount === 12 ? "730px" : "805px" }}
            >
              {shares[shareId].split(" ").map((word, index) => (
                <TextPlace
                  key={index}
                  count={index + 1}
                  text={word}
                  className={classes.textPlace}
                  style={{
                    marginBottom: "1.2rem",
                    width: selectedWordCount === 12 ? "49%" : "32%",
                    alignSelf: index <= (selectedWordCount === 12 ? 9 : 16) ? "flex-start" : "flex-end",
                  }}
                />
              ))}
            </div>
            <div className={classes.backupSharesBody}>
              <div className={classes.backupSharesBox}>
                <p>Share:</p>
                <div className={classes.backupShares}>
                  <p>
                    {shareId + 1} x {sharesNumber}
                  </p>
                </div>
              </div>
            </div>
          </>
        </InputWrapper>
        <p className={classes.shareNumberInfo}>
          {shareId + 1} / {sharesNumber} Shares
        </p>
        {!isNotLastShare && (
          <p className={classes.additionalInfo} style={{ marginBottom: "2.4rem" }}>
            We will confirm your written recovery seed splits on the next screen.
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
