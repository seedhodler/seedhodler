import React from "react"
import CSS from "csstype"

import { AdditionalInfo } from "components/AdditionalInfo"
import { InfoTitle } from "components/InfoTitle"
import { BadgeColorsEnum, badgeColorsObj } from "constants/index"

import classes from "./BadgeTitle.module.scss"

type PropsBase = {
  title: string
  additionalInfo?: string
  color?: BadgeColorsEnum
  className?: string
  style?: CSS.Properties
}

type Props = PropsBase & ({ isInfo?: true; desc: string } | { isInfo?: false; desc?: string })

const BadgeTitle: React.FC<Props> = ({
  title,
  additionalInfo,
  color = BadgeColorsEnum.Main,
  isInfo,
  desc,
  className,
  style,
}) => {
  const classNames = [classes.badgeContainer, className].join(" ")

  return (
    <div className={classNames} style={style}>
      <div className={classes.badge} style={{ backgroundColor: badgeColorsObj[color] }}></div>
      {isInfo ? (
        <InfoTitle
          title={title}
          desc={desc}
          style={{ fontWeight: 600, fontSize: "20px", marginBottom: 0 }}
        />
      ) : (
        <span className={classes.title}>{title}</span>
      )}
      {additionalInfo && (
        <AdditionalInfo info={additionalInfo} color={color} style={{ marginLeft: "3.2rem" }} />
      )}
    </div>
  )
}

export default BadgeTitle
