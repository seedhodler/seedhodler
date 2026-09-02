import CSS from "csstype"
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react"

import CloseIcon from "src/assets/icons/Close.svg"
import { BadgeTitle } from "src/components/BadgeTitle"
import { BadgeColorsEnum } from "src/constants/index"

import classes from "./Modal.module.scss"

type PropsBase = {
  badgeColor?: BadgeColorsEnum
  isActive: boolean
  isSuccess?: boolean
  isConfetti?: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
  children: JSX.Element
  style?: CSS.Properties
}
type Props = PropsBase &
  ({ title: string; isNotification?: false } | { title?: string; isNotification: true })

const Modal: React.FC<Props> = ({
  title,
  badgeColor = BadgeColorsEnum.SuccessLight,
  isActive,
  isSuccess,
  isConfetti,
  setIsActive,
  isNotification,
  children,
  style,
}) => {
  const modalHeaderRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const backdropSwitch = isSuccess ? classes.backdropSuccesActive : classes.backdropActive

  useEffect(() => {
    if (modalHeaderRef && isActive) {
      modalHeaderRef?.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [title, isActive])

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isActive])

  return (
    <>
      {/* {isActive && isConfetti && (
        <Confetti
          style={{
            position: "fixed",
            top: 0,
            left: 0,
          }}
        />
      )} */}

      <div
        onClick={() => setIsActive(false)}
        className={isActive ? backdropSwitch : classes.backdrop}
        style={{ zIndex: isNotification ? 100 : "" }}
      >
        {!isNotification ? (
          <div
            onClick={e => e.stopPropagation()}
            className={isActive ? classes.modalActive : classes.modal}
            style={style}
          >
            <div className={classes.content}>
              {!isSuccess && (
                <div className={classes.modalHeader} ref={modalHeaderRef} id="modal-header">
                  <BadgeTitle title={title} color={badgeColor} headingLevel={2} style={{ marginBottom: 0 }} />
                  <button
                    onClick={() => setIsActive(false)}
                    className={classes.closeBtn}
                    aria-label="Close dialog"
                  >
                    <img src={CloseIcon} alt="" aria-hidden="true" />
                  </button>
                </div>
              )}
              {children}
            </div>
          </div>
        ) : (
          <div className={classes.notificationContainer}>{children}</div>
        )}
      </div>
    </>
  )
}

export default Modal
