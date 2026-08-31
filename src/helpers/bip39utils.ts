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
  //@ts-ignore
  return bip39.entropyToMnemonic(entropyArr)
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

export const validateMnemonic = (mnemonic: string) => {
  return bip39.validateMnemonic(mnemonic)
}

// Most BIP-39 wordlists join words with a normal space; Japanese uses U+3000,
// the ideographic space. Split on either so every language yields the right
// word array. Kept in one place so no caller reinvents it and forgets U+3000.
export const mnemonicToWords = (mnemonic: string): string[] => mnemonic.split(/[ 　]/)
