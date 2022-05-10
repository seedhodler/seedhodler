import React, { useEffect, Dispatch, SetStateAction } from "react"

import CloseIcon from "assets/icons/Close.svg"
import { BadgeTitle } from "components/BadgeTitle"
import { BadgeColorsEnum } from "constants/index"

import classes from "./Modal.module.scss"

type Props = {
  title: string
  badgeColor?: BadgeColorsEnum
  isActive: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
  children: JSX.Element
}

const Modal: React.FC<Props> = ({
  title,
  badgeColor = BadgeColorsEnum.Success,
  isActive,
  setIsActive,
  children,
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
    <div
      onClick={() => setIsActive(false)}
      className={isActive ? classes.backdropActive : classes.backdrop}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={isActive ? classes.contentActive : classes.content}
      >
        <div className={classes.modalHeader}>
          <BadgeTitle title={title} color={badgeColor} style={{ marginBottom: 0 }} />
          <button onClick={() => setIsActive(false)} className={classes.closeBtn}>
            <img src={CloseIcon} alt="Close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
