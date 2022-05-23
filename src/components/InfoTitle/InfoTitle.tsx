import React from "react"
import CSS from "csstype"

import InfoGrayIcon from "assets/icons/InfoGray.svg"
import InfoRedIcon from "assets/icons/InfoRed.svg"

import classes from "./InfoTitle.module.scss"

type Props = {
  title: string
  desc: string
  isError?: boolean
  className?: string
  style?: CSS.Properties
}

const InfoTitle: React.FC<Props> = ({ title, desc, isError, className, style }) => {
  const classNames = [classes.titleContainer, className].join(" ")

  return (
    <div className={classNames} style={style} title={desc}>
      <p className={classes.title}>{title}</p>
      <img src={isError ? InfoRedIcon : InfoGrayIcon} alt="Info" />
    </div>
  )
}

export default InfoTitle
