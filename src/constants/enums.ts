import variables from "styles/Variables.module.scss"

export enum BadgeColorsEnum {
  Main,
  Success,
  SuccessLight,
  ErrorLight,
  Error,
}

export const badgeColorsObj = {
  [BadgeColorsEnum.Main]: variables.colorMain,
  [BadgeColorsEnum.Success]: variables.colorSuccess,
  [BadgeColorsEnum.SuccessLight]: variables.colorSuccessLight,
  [BadgeColorsEnum.ErrorLight]: variables.colorErrorLight,
  [BadgeColorsEnum.Error]: variables.colorError,
}

export enum ButtonColorsEnum {
  Main,
  Success,
  ErrorLightish,
}
