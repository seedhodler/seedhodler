import slip39 from "slip39"

// SLIP-39 operations over a raw master secret (a byte array). SLIP-39 has no
// idea the bytes are a BIP-39 entropy; that meaning lives one layer up, in the
// facade. The app only ever uses a single group, so the group threshold is
// fixed at 1 and the scheme collapses to one { threshold, shares } pair.

export const splitMasterSecret = (
  masterSecret: number[],
  passphrase: string,
  threshold: number,
  shares: number,
): string[] => {
  const node = slip39.fromArray(masterSecret, {
    passphrase,
    threshold: 1,
    groups: [[threshold, shares]],
  })
  return node.fromPath("r/0").mnemonics
}

export const recoverMasterSecret = (shares: string[], passphrase = ""): number[] =>
  slip39.recoverSecret(shares, passphrase)

export const validateShare = (share: string): boolean => slip39.validateMnemonic(share)
