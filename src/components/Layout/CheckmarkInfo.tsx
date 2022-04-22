import React from "react"

import CheckmarkIcon from "assets/icons/Checkmark.svg"

import classes from "./Layout.module.scss"

type Props = {
  children: string
  iconLeft?: string
  additionalInfo?: string
  className?: string
  [x: string]: any
}

const CheckmarkInfo: React.FC<Props> = ({ iconLeft, children, additionalInfo, className, ...restProps }) => {
  const mainClasses = [classes.checkmarkInfoContainer, className].join(" ")

  return (
    <div className={mainClasses} {...restProps}>
      <div className={classes.infoContainer}>
        {iconLeft ? <img src={iconLeft} alt="Left icon" /> : <img src={CheckmarkIcon} alt="Checkmark" />}
        <span className={classes.info}>{children}</span>
      </div>
      {additionalInfo && <span className={classes.additionalInfo}>{additionalInfo}</span>}
    </div>
  )
}

export default CheckmarkInfo
