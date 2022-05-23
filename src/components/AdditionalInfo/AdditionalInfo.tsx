import React from "react"
import CSS from "csstype"

import { BadgeColorsEnum, badgeColorsObj } from "constants/index"

import classes from "./AdditionalInfo.module.scss"

type Props = {
  info: string
  color?: BadgeColorsEnum
  style?: CSS.Properties
}

const AdditionalInfo: React.FC<Props> = ({ info, color = BadgeColorsEnum.SuccessLight, style }) => {
  return (
    <span
      className={classes.additionalInfo}
      style={{
        ...style,
        backgroundColor: badgeColorsObj[color],
      }}
    >
      {info}
    </span>
  )
}

export default AdditionalInfo
