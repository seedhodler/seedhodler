import React, { Dispatch, SetStateAction } from "react"
import CSS from "csstype"
import * as bip39 from "bip39"

import { slip39wordlist } from "constants/"

import classes from "./Input.module.scss"

type Props = {
  count?: number
  index: number
  value: string
  onChange: Dispatch<SetStateAction<string[]>>
  isRestore?: boolean
  className?: string
  containerStyle?: CSS.Properties
}

const Input: React.FC<Props> = ({
  count,
  index,
  value,
  onChange,
  isRestore,
  className,
  containerStyle,
}) => {
  const classNames = [classes.input, className].join(" ")
  const wordlist = isRestore ? slip39wordlist : bip39.wordlists.english

  const handleChange = (newValue: string, isDropdownItemClick?: boolean) => {
    onChange(mnemonicArr =>
      mnemonicArr.map((word, wordIndex) => (wordIndex === index ? newValue : word)),
    )
  }

  let variantsCounter = 0

  return (
    <div className={classes.container} style={containerStyle}>
      {count && <span className={classes.count}>{count}.</span>}
      <input
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        className={classNames}
      />
      {value.length !== 0 && !wordlist.some(word => word === value) && (
        <div className={classes.dropdownList}>
          {wordlist.map(variant => {
            if (variantsCounter < 5 && variant.includes(value.toLowerCase())) {
              variantsCounter++
              return (
                <button
                  onClick={() => handleChange(variant, true)}
                  key={variant}
                  className={classes.dropdownListItem}
                  tabIndex={0}
                >
                  {variant}
                </button>
              )
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}

export default Input
