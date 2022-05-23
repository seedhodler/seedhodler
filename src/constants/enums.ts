import variables from "styles/Variables.module.scss"

export enum BadgeColorsEnum {
  Main,
  MainLight,
  Success,
  SuccessLight,
  ErrorLight,
  Error,
}

export const badgeColorsObj = {
  [BadgeColorsEnum.Main]: variables.colorMain,
  [BadgeColorsEnum.MainLight]: variables.colorMainLight,
  [BadgeColorsEnum.Success]: variables.colorSuccess,
  [BadgeColorsEnum.SuccessLight]: variables.colorSuccessLight,
  [BadgeColorsEnum.ErrorLight]: variables.colorErrorLight,
  [BadgeColorsEnum.Error]: variables.colorError,
}

export enum ButtonColorsEnum {
  Main,
  Success,
  ErrorLightish,
  Neutral,
}

export enum NavigationEnum {
  Prev,
  Next,
}
