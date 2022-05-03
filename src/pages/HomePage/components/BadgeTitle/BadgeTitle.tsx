import React from "react"
import CSS from "csstype"

import variables from "styles/Variables.module.scss"
import { ColorOptions } from "enums"

import classes from "./BadgeTitle.module.scss"

const colors = {
  [ColorOptions.Main]: variables.colorMainLight,
  [ColorOptions.Success]: variables.colorSuccessLight,
  [ColorOptions.ErrorLight]: variables.colorErrorLight,
  [ColorOptions.Error]: variables.colorError,
}

type Props = {
  title: string
  additionalInfo?: string
  color?: ColorOptions
  className?: string
  style?: CSS.Properties
}

const BadgeTitle: React.FC<Props> = ({
  title,
  additionalInfo,
  color = ColorOptions.Main,
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
