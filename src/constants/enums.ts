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

export enum HelpModalTabs {
  Introduction = 1,
  Generating = 2,
  Reconstructing = 3,
  Warning = 4,
  Tips_and_best_practices = 5,
  About = 6,
  Legal = 7,
}
