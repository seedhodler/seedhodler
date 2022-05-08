import React from "react"
import CSS from "csstype"

import classes from "./TextPlace.module.scss"

type Props = {
  text: string
  count: number
  style?: CSS.Properties
}

const TextPlace: React.FC<Props> = ({ text, count, style }) => {
  return (
    <div className={classes.textPlace} style={style}>
      <span className={classes.count}>{count}.</span>
      {text}&nbsp;
    </div>
  )
}

export default TextPlace
