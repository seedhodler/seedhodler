import * as bip39 from "bip39"

export enum Languages {
  English = "english",
}

export const generateMnemonic = (language: Languages, wordCount: number) => {
  bip39.setDefaultWordlist(language)
  const strength = Math.ceil((wordCount * 32) / 3)
  return bip39.generateMnemonic(strength)
}
