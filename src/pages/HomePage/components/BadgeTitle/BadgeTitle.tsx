import React from "react"
import CSS from "csstype"

import variables from "styles/Variables.module.scss"
import { BadgeColorOptions } from "constants/index"

import classes from "./BadgeTitle.module.scss"

const colors = {
  [BadgeColorOptions.Main]: variables.colorMainLight,
  [BadgeColorOptions.Success]: variables.colorSuccessLight,
  [BadgeColorOptions.ErrorLight]: variables.colorErrorLight,
  [BadgeColorOptions.Error]: variables.colorError,
}

type Props = {
  title: string
  additionalInfo?: string
  color?: BadgeColorOptions
  className?: string
  style?: CSS.Properties
}

const BadgeTitle: React.FC<Props> = ({
  title,
  additionalInfo,
  color = BadgeColorOptions.Main,
  className,
  style,
}) => {
  const classNames = [classes.badgeContainer, className].join(" ")

  return (
    <div className={classNames} style={style}>
      <div className={classes.badge} style={{ backgroundColor: colors[color] }}></div>
      <span className={classes.title}>{title}</span>
      {additionalInfo && (
        <span
          className={classes.additionalInfo}
          style={{
            backgroundColor: colors[color],
          }}
        >
          {additionalInfo}
        </span>
      )}
    </div>
  )
}

export default BadgeTitle
