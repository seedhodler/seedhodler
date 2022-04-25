import React, { Dispatch, SetStateAction } from "react"

import classes from "./Switch.module.scss"

type Props = {
  checked: boolean
  onChange: Dispatch<SetStateAction<boolean>>
}

const Switch: React.FC<Props> = ({ checked, onChange }) => {
  return (
    <label className={classes.switch}>
      <input type="checkbox" checked={checked} onChange={() => onChange(!checked)} />
      <span className={classes.slider}></span>
    </label>
  )
}

export default Switch
