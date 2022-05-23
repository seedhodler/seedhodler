import React, { Dispatch, SetStateAction, ChangeEvent } from "react"
import CSS from "csstype"

import { getEntropyDetails } from "helpers"

import classes from "./Textarea.module.scss"

type Props = {
  value: string
  onChange: Dispatch<SetStateAction<string>>
  regex?: RegExp
  minBits: 128 | 256
  entropyTypeId: number
  style?: CSS.Properties
}

const Textarea: React.FC<Props> = ({ value, onChange, regex, minBits, entropyTypeId, style }) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value
    if (regex) {
      newValue = e.target.value.replace(regex, "")
    }
    const { selectedEntropyAsBinary } = getEntropyDetails(
      entropyTypeId === 0 ? newValue : value,
      minBits,
      entropyTypeId,
    )
    if (selectedEntropyAsBinary.length <= minBits || newValue < value) {
      onChange(newValue)
    }
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
