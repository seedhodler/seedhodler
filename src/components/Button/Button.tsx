import React from "react"
import CSS from "csstype"

import classes from "./Button.module.scss"

type Props = {
  children: string
  iconLeft?: string
  iconRight?: string
  fullWidth?: boolean
  disabled?: boolean
  className?: string
  style?: CSS.Properties
}

const Button: React.FC<Props> = ({
  iconLeft,
  iconRight,
  children,
  fullWidth,
  disabled,
  className,
  style,
}) => {
  const classNames = [fullWidth ? classes.btnFullWidth : classes.btn, className].join(" ")

  return (
    <button className={classNames} style={style} disabled={disabled}>
      {iconLeft && <img src={iconLeft} alt="Left icon" className={classes.iconLeft} />}
      {children}
      {iconRight && <img src={iconRight} alt="Left icon" className={classes.iconRight} />}
    </button>
  )
}

export default Button
