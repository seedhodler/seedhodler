// The crypto core. This is the whole cryptographic surface of Seedhodler, kept
// React-free and free of UI concerns so it stays the small, self-contained part
// a reviewer reads.
//
// The one invariant to understand: a share scheme's master secret IS the BIP-39
// entropy of the seed. Splitting runs mnemonic -> entropy -> master secret ->
// shares; recovering runs it backwards. That equivalence is why a share set
// restores the exact seed, and it lives in splitSeed / recoverSeed below,
// nowhere else. It holds for both schemes: SLIP-39 and SSKR split the same
// entropy bytes, only the share encoding differs.

import * as bip39 from "./bip39"
import { hexStringToByteArray } from "./bytes"
import * as slip39 from "./slip39"
import * as sskr from "./sskr"

export type Scheme = "slip39" | "sskr"

// Generate a fresh seed (BIP-39 mnemonic) of the given word count.
export const generateSeed = (language: string, wordCount: number): string =>
  bip39.generateMnemonic(language, wordCount)

// Derive the seed deterministically from user-supplied entropy (advanced mode).
export const seedFromEntropy = (language: string, binaryEntropy: string): string =>
  bip39.generateMnemonicFromEntropy(language, binaryEntropy)

type SplitOptions = { scheme?: Scheme; threshold: number; shares: number; passphrase?: string }

// Split a seed into shares. Here is the whole invariant in one place: this seed's
// BIP-39 entropy is the master secret both schemes split. The scheme only decides
// how the resulting shares are encoded (SLIP-39 words vs SSKR bytewords).
export const splitSeed = (
  mnemonic: string,
  { scheme = "slip39", threshold, shares, passphrase = "" }: SplitOptions,
): string[] => {
  const masterSecret = hexStringToByteArray(bip39.mnemonicToEntropy(mnemonic))
  return scheme === "sskr"
    ? sskr.splitMasterSecret(masterSecret, threshold, shares)
    : slip39.splitMasterSecret(masterSecret, passphrase, threshold, shares)
}

// Which scheme a set of full shares belongs to, or null when it is ambiguous,
// mixed, or none-valid. SLIP-39 words and SSKR bytewords never cross-validate, so
// a unanimous set decides; anything else must fail loudly rather than guess.
export const detectScheme = (shares: string[]): Scheme | null => {
  if (shares.length === 0) return null
  const allSskr = shares.every(sskr.isShare)
  const allSlip39 = shares.every(slip39.validateShare)
  if (allSskr && !allSlip39) return "sskr"
  if (allSlip39 && !allSskr) return "slip39"
  return null
}

export type RecoverResult = { mnemonic: string; error: false } | { error: string }

// Recover the seed from enough shares. The scheme is detected from the shares
// themselves. The recovered master secret is that same BIP-39 entropy, encoded
// back into a mnemonic. A non-SSKR set falls through to SLIP-39, so a partial or
// below-threshold set still surfaces the SLIP-39 library's own "need N more"
// message that the restore UI parses.
export const recoverSeed = (shares: string[], passphrase = ""): RecoverResult => {
  try {
    const masterSecret =
      detectScheme(shares) === "sskr"
        ? sskr.recoverMasterSecret(shares)
        : slip39.recoverMasterSecret(shares, passphrase)
    const mnemonic = bip39.entropyToMnemonic(Buffer.from(masterSecret))
    return { mnemonic, error: false }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unexpected error" }
  }
}

export const validateSeed = (mnemonic: string): boolean => bip39.validateMnemonic(mnemonic)

// Per-share validity for the restore UI. SLIP-39 only for now; the restore input
// is SLIP-39-shaped until the UI grows a scheme selector (Post-v1).
export const validateShare = (share: string): boolean => slip39.validateShare(share)
