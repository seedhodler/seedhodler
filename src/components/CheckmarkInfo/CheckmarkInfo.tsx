import React from "react"
import CSS from "csstype"

import CheckmarkIcon from "assets/icons/Checkmark.svg"
import CheckmarkFilledIcon from "assets/icons/CheckmarkFilled.svg"

import classes from "./CheckmarkInfo.module.scss"

type Props = {
  children: string
  iconLeft?: string
  filled?: boolean
  additionalInfo?: string
  className?: string
  infoClassName?: string
  style?: CSS.Properties
}

const CheckmarkInfo: React.FC<Props> = ({
  iconLeft,
  children,
  filled,
  additionalInfo,
  className,
  infoClassName,
  style,
}) => {
  const mainClasses = [classes.checkmarkInfoContainer, className].join(" ")
  const infoClasses = [classes.info, infoClassName].join(" ")

  return (
    <div className={mainClasses} style={style}>
      <div className={classes.infoContainer}>
        {iconLeft ? (
          <img src={iconLeft} alt="Left icon" />
        ) : (
          <img src={filled ? CheckmarkFilledIcon : CheckmarkIcon} alt="Checkmark" style={{ width: "20px" }} />
        )}
        <span className={infoClasses}>{children}</span>
      </div>
      {additionalInfo && <span className={classes.additionalInfo}>{additionalInfo}</span>}
    </div>
  )
}

export default CheckmarkInfo
