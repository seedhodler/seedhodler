import React from "react"
import CSS from "csstype"

import classes from "./TextPlace.module.scss"

type Props = {
  text: string
  count: number
  isSuccess?: boolean
  className?: string
  style?: CSS.Properties
}

const TextPlace: React.FC<Props> = ({ text, count, isSuccess, className, style }) => {
  const classNames = [classes.textPlace, className]
  if (isSuccess) {
    classNames.push(classes.success)
  }

  return (
    <div className={classNames.join(" ")} style={style}>
      <span className={classes.count}>{count}.</span>
      {text}&nbsp;
    </div>
  )
}

export default TextPlace
