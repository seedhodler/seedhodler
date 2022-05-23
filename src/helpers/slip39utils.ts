import * as slip39 from "slip39/src/slip39"

import { entropyToMnemonic } from "./bip39utils"

export const getFormattedShares = (
  masterSecret: number[],
  passphrase: string,
  threshold: number,
  groups: number[][],
) => {
  const slipNode = slip39.fromArray(masterSecret, {
    passphrase,
    threshold,
    groups,
  })

  return slipNode.fromPath("r/" + 0).mnemonics
}

export const restoreMnemonic = (shares: string[], passphrase = "") => {
  try {
    const secret = slip39.recoverSecret(shares, passphrase)
    const entropy = Buffer.from(secret)
    const mnemonic = entropyToMnemonic(entropy)
    return { mnemonic, error: false }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unexpected error" }
  }
}

export const validateShare = (share: string) => {
  return slip39.validateMnemonic(share)
}
