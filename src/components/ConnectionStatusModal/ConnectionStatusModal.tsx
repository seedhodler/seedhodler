import React, { Dispatch, SetStateAction } from "react"

import { ColorOptions } from "enums"
import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import InternetRedIcon from "assets/icons/InternetRed.svg"
import InternetGrayIcon from "assets/icons/InternetGray.svg"
import CheckmarkFilledIcon from "assets/icons/CheckmarkFilled.svg"
import { Modal } from "components/Modal"
import { CheckmarkInfo } from "components/CheckmarkInfo"
import { Button } from "components/Button"

import classes from "./ConnectionStatusModal.module.scss"

type Props = {
  isOnline: boolean
  isModalActive: boolean
  setIsModalActive: Dispatch<SetStateAction<boolean>>
  currentStep: number
  setCurrentStep: Dispatch<SetStateAction<number>>
}

const ConnectionStatusModal: React.FC<Props> = ({
  isOnline,
  isModalActive,
  setIsModalActive,
  currentStep,
  setCurrentStep,
}) => {
  const isFirstStep = currentStep === 0
  const btnText = isFirstStep ? "Ok! Got it" : isOnline ? "Continue at your own risk!" : "The coast is clear"

  const handleBtnClick = () => {
    if (isFirstStep) {
      setCurrentStep(prev => ++prev)
    } else {
      setIsModalActive(false)
    }
  }

  return (
    <Modal
      badgeColor={isFirstStep ? ColorOptions.Success : ColorOptions.Error}
      title={isFirstStep ? "Getting Started" : "Make Sure you are Offline"}
      isActive={isModalActive}
      setIsActive={setIsModalActive}
    >
      <div className={classes.contentContainer}>
        <div>
          {isFirstStep ? (
            <>
              <p className={classes.description}>
                Now we are going to take you through the process of generating your Seed recovery phrases.
                Your Seedhodler recovery phrase is either a 12 or 24-word phrase that will be used to restore
                your assets whenever necessary.
              </p>
              <p className={classes.checkmarksTitle}>You will need:</p>
              <CheckmarkInfo filled infoClassName={classes.checkmarkInfo}>
                5 minutes
              </CheckmarkInfo>
              <CheckmarkInfo filled infoClassName={classes.checkmarkInfo}>
                Piece of paper
              </CheckmarkInfo>
              <CheckmarkInfo filled infoClassName={classes.checkmarkInfo}>
                Pen or pencil
              </CheckmarkInfo>
            </>
          ) : (
            <>
              <p className={classes.description}>
                For security reasons this application should only be used in an offline Environment. Reducing
                any possibilities for Hacking is key to keeping you assets safe.
              </p>
              <p className={classes.checkmarksTitle} style={{ marginBottom: "3.6rem" }}>
                Connection Status:
              </p>
              <div className={classes.stepTwoContent}>
                <div className={classes.internetIconContainer}>
                  <img src={isOnline ? InternetRedIcon : InternetGrayIcon} alt="Connection status" />
                  {!isOnline && (
                    <img src={CheckmarkFilledIcon} alt="Checkmark" className={classes.checkmarkIcon} />
                  )}
                </div>
                {isOnline ? (
                  <>
                    <p className={classes.checkmarksTitle} style={{ fontSize: "24px" }}>
                      Beware! You are Currently Online
                    </p>
                    <p className={classes.description} style={{ textAlign: "center" }}>
                      It would be best to physically disconnect any cables from the internet or turn off your
                      Network Adapters
                    </p>
                  </>
                ) : (
                  <p className={classes.checkmarksTitle}>Great, You are Offline</p>
                )}
              </div>
            </>
          )}
        </div>
        <Button onClick={handleBtnClick} iconRight={ArrowRightIcon}>
          {btnText}
        </Button>
      </div>
    </Modal>
  )
}

export default ConnectionStatusModal
