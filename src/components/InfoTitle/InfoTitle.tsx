import React from "react"
import CSS from "csstype"

import InfoGrayIcon from "assets/icons/InfoGray.svg"

import classes from "./InfoTitle.module.scss"

type Props = {
  title: string
  className?: string
  style?: CSS.Properties
}

const InfoTitle: React.FC<Props> = ({ title, className, style }) => {
  const classNames = [classes.titleContainer, className].join(" ")

  return (
    <div className={classNames} style={style}>
      <p className={classes.title}>{title}</p>
      <img src={InfoGrayIcon} alt="Info" />
    </div>
  )
}

export default InfoTitle
