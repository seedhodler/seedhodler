import CSS from "csstype"
import React, { ChangeEvent, Dispatch, SetStateAction } from "react"

import { symbolsForMinBits } from "src/helpers"

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
    const filtered = regex ? e.target.value.replace(regex, "") : e.target.value

    // Cap by symbol count, not by a bits <= minBits budget. Dice and decimal
    // symbols do not divide minBits evenly, so the old bit budget rejected the
    // very symbol that would have reached enough: the field stalled one throw
    // short of minBits forever and the seed could never be generated. Capping to
    // the fewest symbols that carry minBits fills to just past the target and
    // stops (a paste is truncated the same way); the entropy is trimmed to
    // exactly minBits downstream.
    onChange(filtered.slice(0, symbolsForMinBits(entropyTypeId, minBits)))
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
