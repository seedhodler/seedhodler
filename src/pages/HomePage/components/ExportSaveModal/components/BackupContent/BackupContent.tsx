import React, { Dispatch, SetStateAction, useEffect, useRef } from "react"

import ArrowLeftIcon from "src/assets/icons/ArrowLeft.svg"
import ArrowRightIcon from "src/assets/icons/ArrowRight.svg"
import LogoIcon from "src/assets/icons/Logo.svg"

import { Button } from "src/components/Button"
import { ShareHeader } from "src/components/ShareHeader"
import { TextPlace } from "src/components/TextPlace"
import { NavigationEnum } from "src/constants/"

import { AdditionalInfo } from "src/components/AdditionalInfo"
import { InputWrapper } from "src/components/InputWrapper"
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
  const descRef = useRef() as React.MutableRefObject<HTMLParagraphElement>

  const mediaWidthWindow = window.matchMedia("(max-width: 840px)").matches

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
              style={{ columnCount: selectedWordCount === 12 || mediaWidthWindow ? 2 : 3 }}
            >
              {shares[shareId].split(" ").map((word, index) => (
                <TextPlace
                  key={index}
                  count={index + 1}
                  text={word}
                  className={classes.textPlace}
                  style={{ marginBottom: "1.2rem" }}
                />
              ))}
            </div>
            <div className={classes.backupSharesBody}>
              <div className={classes.backupSharesBox}>
                <p>Share:</p>
                <div className={classes.backupShares}>
                  <p>
                    {shareId + 1}x{sharesNumber}
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
