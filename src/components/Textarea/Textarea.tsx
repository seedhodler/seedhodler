import React, { Dispatch, SetStateAction } from "react"
import CSS from "csstype"

import classes from "./Textarea.module.scss"

type Props = {
  value: string
  onChange: Dispatch<SetStateAction<string>>
  style?: CSS.Properties
}

const Textarea: React.FC<Props> = ({ value, onChange, style }) => {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={3}
      className={classes.textarea}
      style={style}
    />
  )
}

export default Textarea
