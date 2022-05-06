import React from "react"
import CSS from "csstype"

import { ButtonColorOptions } from "constants/index"

import classes from "./Button.module.scss"

type Props = {
  children: string
  onClick: () => void
  iconLeft?: string
  iconRight?: string
  fullWidth?: boolean
  disabled?: boolean
  color?: ButtonColorOptions
  className?: string
  style?: CSS.Properties
}

const colorClasses = {
  [ButtonColorOptions.Main]: classes.btnColorMain,
  [ButtonColorOptions.Success]: classes.btnColorSuccess,
  [ButtonColorOptions.ErrorLightish]: classes.btnColorErrorLightish,
}

const Button: React.FC<Props> = ({
  iconLeft,
  onClick,
  iconRight,
  children,
  fullWidth,
  disabled,
  color = ButtonColorOptions.Main,
  className,
  style,
}) => {
  const classNames = [colorClasses[color], className]
  if (fullWidth) {
    classNames.push(classes.fullWidth)
  }

  return (
    <button onClick={onClick} className={classNames.join(" ")} style={style} disabled={disabled}>
      {iconLeft && <img src={iconLeft} alt="Left icon" className={classes.iconLeft} />}
      {children}
      {iconRight && <img src={iconRight} alt="Left icon" className={classes.iconRight} />}
    </button>
  )
}

export default Button
