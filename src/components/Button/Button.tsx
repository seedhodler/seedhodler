import React from "react"
import CSS from "csstype"

import { ButtonColorsEnum } from "constants/index"
import { Loader } from "components/Loader"

import classes from "./Button.module.scss"

type Props = {
  children: string
  onClick: () => void
  isLoading?: boolean
  iconLeft?: string
  iconRight?: string
  fullWidth?: boolean
  disabled?: boolean
  color?: ButtonColorsEnum
  className?: string
  style?: CSS.Properties
}

const colorClasses = {
  [ButtonColorsEnum.Main]: classes.btnColorMain,
  [ButtonColorsEnum.Success]: classes.btnColorSuccess,
  [ButtonColorsEnum.ErrorLightish]: classes.btnColorErrorLightish,
  [ButtonColorsEnum.Neutral]: classes.btnColorNeutral,
}

const Button: React.FC<Props> = ({
  iconLeft,
  onClick,
  isLoading,
  iconRight,
  children,
  fullWidth,
  disabled,
  color = ButtonColorsEnum.Main,
  className,
  style,
}) => {
  const classNames = [colorClasses[color], className]
  if (fullWidth) {
    classNames.push(classes.fullWidth)
  }

  return (
    <button onClick={onClick} className={classNames.join(" ")} style={style} disabled={disabled}>
      {iconLeft && <img src={iconLeft} alt="Left icon" />}
      {children}
      {isLoading ? <Loader /> : iconRight && <img src={iconRight} alt="Left icon" />}
    </button>
  )
}

export default Button
