import React from "react"

import classes from "./BadgeTitle.module.scss"

type Props = {
  title: string
  additionalInfo?: string
}

const BadgeTitle: React.FC<Props> = ({ title, additionalInfo }) => {
  return (
    <div className={classes.badgeContainer}>
      <div className={classes.badge}></div>
      <span className={classes.title}>{title}</span>
      {additionalInfo && <span className={classes.additionalInfo}>{additionalInfo}</span>}
    </div>
  )
}

export default BadgeTitle
