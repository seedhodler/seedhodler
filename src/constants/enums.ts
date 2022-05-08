import variables from "styles/Variables.module.scss"

export enum BadgeColorsEnum {
  Main,
  Success,
  ErrorLight,
  Error,
}

export const badgeColorsObj = {
  [BadgeColorsEnum.Main]: variables.colorMainLight,
  [BadgeColorsEnum.Success]: variables.colorSuccessLight,
  [BadgeColorsEnum.ErrorLight]: variables.colorErrorLight,
  [BadgeColorsEnum.Error]: variables.colorError,
}

export enum ButtonColorsEnum {
  Main,
  Success,
  ErrorLightish,
}
