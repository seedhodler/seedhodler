import React, { useEffect, Dispatch, SetStateAction } from "react"
import CSS from "csstype"
import Confetti from "react-confetti"

import CloseIcon from "assets/icons/Close.svg"
import { BadgeTitle } from "components/BadgeTitle"
import { BadgeColorsEnum } from "constants/index"

import classes from "./Modal.module.scss"

type PropsBase = {
  badgeColor?: BadgeColorsEnum
  isActive: boolean
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
  isConfetti,
  setIsActive,
  isNotification,
  children,
  style,
}) => {
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
      {isActive && isConfetti && (
        <Confetti
          style={{
            position: "fixed",
            top: 0,
            left: 0,
          }}
        />
      )}
      <div
        onClick={() => setIsActive(false)}
        className={isActive ? classes.backdropActive : classes.backdrop}
        style={{ zIndex: isNotification ? 100 : "" }}
      >
        {!isNotification ? (
          <div
            onClick={e => e.stopPropagation()}
            className={isActive ? classes.modalActive : classes.modal}
            style={style}
          >
            <div className={classes.content}>
              <div className={classes.modalHeader}>
                <BadgeTitle title={title} color={badgeColor} style={{ marginBottom: 0 }} />
                <button onClick={() => setIsActive(false)} className={classes.closeBtn}>
                  <img src={CloseIcon} alt="Close" />
                </button>
              </div>
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
