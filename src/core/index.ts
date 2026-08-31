// The crypto core. This is the whole cryptographic surface of Seedhodler, kept
// React-free and free of UI concerns so it stays the small, self-contained part
// a reviewer reads.
//
// The one invariant to understand: a SLIP-39 master secret IS the BIP-39
// entropy of the seed. Splitting runs mnemonic -> entropy -> master secret ->
// shares; recovering runs it backwards. That equivalence is why a share set
// restores the exact seed, and it lives in splitSeed / recoverSeed below,
// nowhere else.
//
// Only SLIP-39 exists today. SSKR is a decided-but-unbuilt second scheme; when
// it lands it slots in behind this same facade (a scheme parameter on
// splitSeed / recoverSeed), not by scattering crypto through the UI again.

import * as bip39 from "./bip39"
import { hexStringToByteArray } from "./bytes"
import * as slip39 from "./slip39"

// Generate a fresh seed (BIP-39 mnemonic) of the given word count.
export const generateSeed = (language: string, wordCount: number): string =>
  bip39.generateMnemonic(language, wordCount)

// Derive the seed deterministically from user-supplied entropy (advanced mode).
export const seedFromEntropy = (language: string, binaryEntropy: string): string =>
  bip39.generateMnemonicFromEntropy(language, binaryEntropy)

type SplitOptions = { threshold: number; shares: number; passphrase?: string }

// Split a seed into SLIP-39 shares. Here is the whole invariant in one place:
// this seed's BIP-39 entropy is the SLIP-39 master secret.
export const splitSeed = (mnemonic: string, { threshold, shares, passphrase = "" }: SplitOptions): string[] => {
  const masterSecret = hexStringToByteArray(bip39.mnemonicToEntropy(mnemonic))
  return slip39.splitMasterSecret(masterSecret, passphrase, threshold, shares)
}

export type RecoverResult = { mnemonic: string; error: false } | { error: string }

// Recover the seed from enough shares. The recovered master secret is that same
// BIP-39 entropy, encoded back into a mnemonic.
export const recoverSeed = (shares: string[], passphrase = ""): RecoverResult => {
  try {
    const masterSecret = slip39.recoverMasterSecret(shares, passphrase)
    const mnemonic = bip39.entropyToMnemonic(Buffer.from(masterSecret))
    return { mnemonic, error: false }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unexpected error" }
  }
}

export const validateSeed = (mnemonic: string): boolean => bip39.validateMnemonic(mnemonic)

export const validateShare = (share: string): boolean => slip39.validateShare(share)
