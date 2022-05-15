import React from "react"
import CSS from "csstype"

import classes from "./TextPlace.module.scss"

type Props = {
  text: string
  count: number
  className?: string
  style?: CSS.Properties
}

const TextPlace: React.FC<Props> = ({ text, count, className, style }) => {
  const classNames = [classes.textPlace, className].join(" ")

  return (
    <div className={classNames} style={style}>
      <span className={classes.count}>{count}.</span>
      {text}&nbsp;
    </div>
  )
}

export default TextPlace
