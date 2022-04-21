import React from "react"

import CheckmarkIcon from "assets/icons/Checkmark.svg"

import classes from "./Layout.module.scss"

type Props = {
  children: string
  iconLeft?: string
  additionalInfo?: string
}

const CheckmarkInfo: React.FC<Props> = ({ iconLeft, children, additionalInfo }) => {
  return (
    <div className={classes.checkmarkInfoContainer}>
      <div className={classes.infoContainer}>
        {iconLeft ? <img src={iconLeft} alt="Left icon" /> : <img src={CheckmarkIcon} alt="Checkmark" />}
        <span className={classes.info}>{children}</span>
      </div>
      {additionalInfo && <span className={classes.additionalInfo}>{additionalInfo}</span>}
    </div>
  )
}

export default CheckmarkInfo
