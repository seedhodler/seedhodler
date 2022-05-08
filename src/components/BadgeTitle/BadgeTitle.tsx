import React from "react"
import CSS from "csstype"

import { AdditionalInfo } from "components/AdditionalInfo"
import { BadgeColorsEnum, badgeColorsObj } from "constants/index"

import classes from "./BadgeTitle.module.scss"

type Props = {
  title: string
  additionalInfo?: string
  color?: BadgeColorsEnum
  className?: string
  style?: CSS.Properties
}

const BadgeTitle: React.FC<Props> = ({
  title,
  additionalInfo,
  color = BadgeColorsEnum.Main,
  className,
  style,
}) => {
  const classNames = [classes.badgeContainer, className].join(" ")

  return (
    <div className={classNames} style={style}>
      <div className={classes.badge} style={{ backgroundColor: badgeColorsObj[color] }}></div>
      <span className={classes.title}>{title}</span>
      {additionalInfo && <AdditionalInfo info={additionalInfo} color={color} />}
    </div>
  )
}

export default BadgeTitle
