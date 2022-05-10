import React from "react"
import CSS from "csstype"

import classes from "./ShareHeader.module.scss"

type Props = {
  text: string
  style?: CSS.Properties
}

const ShareHeader: React.FC<Props> = ({ text, style }) => {
  return (
    <div className={classes.shareHeaderContainer} style={style}>
      <div className={classes.shareHeaderDot}></div>
      <p className={classes.shareHeaderText}>{text}</p>
    </div>
  )
}

export default ShareHeader
