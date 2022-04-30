import React, { Dispatch, SetStateAction, ChangeEvent } from "react"
import CSS from "csstype"

import classes from "./Textarea.module.scss"

type Props = {
  value: string
  onChange: Dispatch<SetStateAction<string>>
  regExp?: RegExp
  style?: CSS.Properties
}

const Textarea: React.FC<Props> = ({ value, onChange, regExp, style }) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value
    if (regExp) {
      newValue = e.target.value.replace(regExp, "")
    }
    onChange(newValue)
  }

  return (
    <textarea
      value={value}
      onChange={e => handleChange(e)}
      rows={3}
      className={classes.textarea}
      style={style}
    />
  )
}

export default Textarea
