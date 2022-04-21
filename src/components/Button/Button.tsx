import React from "react"

import classes from "./Button.module.scss"

type Props = {
  children: string
  iconLeft?: string
  iconRight?: string
}

const Button: React.FC<Props> = ({ iconLeft, iconRight, children }) => {
  return (
    <button className={classes.btn}>
      {iconLeft && <img src={iconLeft} alt="Left icon" className={classes.iconLeft} />}
      {children}
      {iconRight && <img src={iconRight} alt="Left icon" className={classes.iconRight} />}
    </button>
  )
}

export default Button
