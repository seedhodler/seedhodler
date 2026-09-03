import CSS from "csstype"
import React from "react"

import InfoGrayIcon from "src/assets/icons/InfoGray.svg"
import InfoRedIcon from "src/assets/icons/InfoRed.svg"
import { Tooltip } from "src/components/Tooltip"

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
    <div className={classNames} style={style}>
      <p className={classes.title}>{title}</p>
      {/* The info icon now uses the shared Tooltip (instant styled bubble, keyboard
          focusable, aria-describedby) instead of the slow native title attribute,
          matching the entropy and scheme tooltips. */}
      <Tooltip content={desc} label={`About ${title}`}>
        <img src={isError ? InfoRedIcon : InfoGrayIcon} alt="" aria-hidden="true" />
      </Tooltip>
    </div>
  )
}

export default InfoTitle
