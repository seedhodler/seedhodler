import React, { Dispatch, SetStateAction } from "react"
import CSS from "csstype"

import classes from "./Input.module.scss"

type Props = {
  count: number
  value: string
  onChange: Dispatch<SetStateAction<string>>
  variants?: string[]
  className?: string
  containerStyle?: CSS.Properties
}

const Input: React.FC<Props> = ({ count, value, onChange, variants, className, containerStyle }) => {
  const classNames = [classes.input, className].join(" ")

  return (
    <div className={classes.container} style={containerStyle}>
      <span className={classes.count}>{count}.</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className={classNames} />
      {variants?.some(item => item.includes(value)) && (
        <div className={classes.dropdownList}>
          {variants.map(variant => {
            if (variant.includes(value)) {
              return (
                <div onClick={() => onChange(variant)} key={variant} className={classes.dropdownListItem}>
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
