import React, { useState, Dispatch, SetStateAction } from "react"
import CSS from "csstype"
import * as bip39 from "bip39"

import classes from "./Input.module.scss"

type Props = {
  count?: number
  index: number
  value: string
  onChange: Dispatch<SetStateAction<string[]>>
  className?: string
  containerStyle?: CSS.Properties
}

const Input: React.FC<Props> = ({ count, index, value, onChange, className, containerStyle }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const classNames = [classes.input, className].join(" ")
  const wordlist = bip39.wordlists.english

  const handleChange = (newValue: string, isDropdownItemClick?: boolean) => {
    onChange(mnemonicArr => mnemonicArr.map((word, wordIndex) => (wordIndex === index ? newValue : word)))
    if (isDropdownItemClick && showDropdown) {
      setShowDropdown(false)
    }
  }

  let variantsCounter = 0

  return (
    <div className={classes.container} style={containerStyle}>
      {count && <span className={classes.count}>{count}.</span>}
      <input
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        onClick={() => setShowDropdown(prev => !prev)}
        className={classNames}
      />
      {showDropdown && value.length !== 0 && (
        <div className={classes.dropdownList}>
          {wordlist.map(variant => {
            if (variantsCounter < 5 && variant.includes(value.toLowerCase())) {
              variantsCounter++
              return (
                <div
                  onClick={() => handleChange(variant, true)}
                  key={variant}
                  className={classes.dropdownListItem}
                  tabIndex={0}
                >
                  {variant}
                </div>
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
