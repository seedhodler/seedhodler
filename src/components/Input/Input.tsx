import React, { Dispatch, SetStateAction } from "react"

import classes from "./Input.module.scss"

type Props = {
  count: number
  value: string
  //   onChange: () => void
  onChange: Dispatch<SetStateAction<string>>
}

const Input: React.FC<Props> = ({ count, value, onChange }) => {
  return (
    <div className={classes.container}>
      <span className={classes.count}>{count}.</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className={classes.input} />
    </div>
  )
}

export default Input
