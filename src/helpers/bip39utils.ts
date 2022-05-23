import * as bip39 from "bip39"
import { binaryStrToEntropyArray } from "./entropyUtils"

export const generateMnemonic = (language: string, wordCount: number) => {
  bip39.setDefaultWordlist(language)

  const strength = Math.ceil((wordCount * 32) / 3)
  return bip39.generateMnemonic(strength)
}

export const generateMnemonicFromEntropy = (language: string, binaryStr: string) => {
  bip39.setDefaultWordlist(language)

  const entropyArr = binaryStrToEntropyArray(binaryStr)
  // TODO: get rid of any
  return bip39.entropyToMnemonic(entropyArr as any)
}

export const mnemonicToEntropy = (mnemonic: string) => {
  return bip39.mnemonicToEntropy(mnemonic)
}

export const mnemonicToSeed = (mnemonic: string) => {
  return bip39.mnemonicToSeedSync(mnemonic)
}

export const entropyToMnemonic = (entropy: Buffer) => {
  return bip39.entropyToMnemonic(entropy)
}
