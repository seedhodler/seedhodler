import React from "react"

import { BadgeColorsEnum, badgeColorsObj } from "constants/index"

import classes from "./AdditionalInfo.module.scss"

type Props = {
  info: string
  color?: BadgeColorsEnum
}

const AdditionalInfo: React.FC<Props> = ({ info, color = BadgeColorsEnum.SuccessLight }) => {
  return (
    <span
      className={classes.additionalInfo}
      style={{
        backgroundColor: badgeColorsObj[color],
      }}
    >
      {info}
    </span>
  )
}

export default AdditionalInfo
