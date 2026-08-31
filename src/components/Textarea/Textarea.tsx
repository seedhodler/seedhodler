import CSS from "csstype"
import React, { ChangeEvent, Dispatch, SetStateAction } from "react"

import { getEntropyDetails } from "src/helpers"

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
    // Drop characters the current entropy type does not allow (each type carries
    // its own regex: hex, binary, dice, decimal) before anything measures it.
    const newValue = regex ? e.target.value.replace(regex, "") : e.target.value

    // Measure what the user just typed, for every type. The old code only used
    // newValue for hex and fell back to the stale previous `value` for the other
    // three, so the length cap was computed against the wrong string.
    const { selectedEntropyDetails } = getEntropyDetails(newValue, minBits, entropyTypeId)

    // Accept while the input stays within the entropy budget, and always accept a
    // deletion so the field can be shortened even when it is already at (or over)
    // the cap, e.g. after a word-count switch lowered minBits. The old check was
    // `newValue < value`, a lexicographic compare that only approximated "shorter"
    // for a backspace at the end and inverted for deletions in the middle.
    const withinBudget = selectedEntropyDetails.totalBits <= minBits
    const isDeletion = newValue.length < value.length
    if (withinBudget || isDeletion) {
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
