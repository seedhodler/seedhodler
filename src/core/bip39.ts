import * as bip39 from "bip39"

import { binaryStrToEntropyArray } from "./bytes"

// Thin wrappers over the bip39 package. setDefaultWordlist mutates a global that
// every call shares, so the language is set right before each use.

export const generateMnemonic = (language: string, wordCount: number): string => {
  bip39.setDefaultWordlist(language)
  const strength = Math.ceil((wordCount * 32) / 3)
  return bip39.generateMnemonic(strength)
}

export const generateMnemonicFromEntropy = (language: string, binaryStr: string): string => {
  bip39.setDefaultWordlist(language)
  const entropyArr = binaryStrToEntropyArray(binaryStr)
  // @ts-ignore the bip39 types want a hex string; the number[] form works too
  return bip39.entropyToMnemonic(entropyArr)
}

export const mnemonicToEntropy = (mnemonic: string): string => bip39.mnemonicToEntropy(mnemonic)

export const entropyToMnemonic = (entropy: Buffer): string => bip39.entropyToMnemonic(entropy)

export const validateMnemonic = (mnemonic: string): boolean => bip39.validateMnemonic(mnemonic)
