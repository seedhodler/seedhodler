import React from "react"
import CSS from "csstype"

import variables from "styles/Variables.module.scss"

import classes from "./BadgeTitle.module.scss"

type Props = {
  title: string
  additionalInfo?: string
  color?: "main" | "success"
  className?: string
  style?: CSS.Properties
}

const BadgeTitle: React.FC<Props> = ({ title, additionalInfo, color = "main", className, style }) => {
  const classNames = [classes.badgeContainer, className].join(" ")

  return (
    <div className={classNames} style={style}>
      <div
        className={classes.badge}
        style={{ backgroundColor: color === "main" ? variables.colorMainLight : variables.colorSuccessLight }}
      ></div>
      <span className={classes.title}>{title}</span>
      {additionalInfo && (
        <span
          className={classes.additionalInfo}
          style={{
            backgroundColor: color === "main" ? variables.colorMainLight : variables.colorSuccessLight,
          }}
        >
          {additionalInfo}
        </span>
      )}
    </div>
  )
}

export default BadgeTitle
