import React, { Dispatch, SetStateAction } from "react"
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
  const classNames = [classes.input, className].join(" ")
  const wordlist = bip39.wordlists.english

  const handleChange = (newValue: string) => {
    onChange(mnemonicArr => mnemonicArr.map((word, wordIndex) => (wordIndex === index ? newValue : word)))
  }

  let variantsCounter = 0

  return (
    <div className={classes.container} style={containerStyle}>
      {count && <span className={classes.count}>{count}.</span>}
      <input
        type="text"
        defaultValue={value}
        onChange={e => handleChange(e.target.value)}
        // onBlur={e => {
        //   value !== e.target.value &&
        //     onChange(mnemonicArr =>
        //       mnemonicArr.map((word, wordIndex) => (wordIndex === index ? e.target.value : word)),
        //     )
        // }}
        className={classNames}
      />
      {value.length !== 0 &&
        wordlist.some(item => item.includes(value) && item !== value) &&
        !wordlist.some(item => item === value) && (
          <div className={classes.dropdownList}>
            {wordlist.map(variant => {
              if (variantsCounter < 5 && variant.includes(value)) {
                variantsCounter++
                return (
                  <div
                    onClick={() => handleChange(variant)}
                    key={variant}
                    className={classes.dropdownListItem}
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
