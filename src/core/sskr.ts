import { GroupSpec, Secret, Spec, sskrCombine, sskrGenerate } from "@bcts/sskr"
// bytewords is not a top-level bc-ur export; the codec lives in a submodule.
// Safe against the pinned bc-ur version (1.1.13 has no exports map to hide it).
import bytewords from "@ngraveio/bc-ur/dist/bytewords.js"

// SSKR (Blockchain Commons) over a raw master secret. Like SLIP-39, SSKR has no
// idea the bytes are a BIP-39 entropy; that meaning lives one layer up, in the
// facade. The app uses a single group, so the group threshold is fixed at 1 and
// the scheme collapses to one { threshold, shares } pair.
//
// A share is emitted as bytewords in the STANDARD style: space-separated
// four-letter words with a trailing four-byte CRC. That is 25 words for a
// 16-byte secret (12-word seed) and 41 for a 32-byte secret (24-word seed).
// SSKR has no passphrase concept, unlike SLIP-39.

const STANDARD = bytewords.STYLES.STANDARD

const toHex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex")
const fromHex = (hex: string): Uint8Array => Uint8Array.from(Buffer.from(hex, "hex"))

export const splitMasterSecret = (
  masterSecret: number[],
  threshold: number,
  shares: number,
): string[] => {
  const secret = Secret.new(Uint8Array.from(masterSecret))
  const spec = Spec.new(1, [GroupSpec.new(threshold, shares)])
  const groups = sskrGenerate(spec, secret)
  return groups[0].map((share: Uint8Array) => bytewords.encode(toHex(share), STANDARD))
}

export const recoverMasterSecret = (shares: string[]): number[] => {
  const shareBytes = shares.map(words => fromHex(bytewords.decode(words, STANDARD)))
  return Array.from(sskrCombine(shareBytes).getData())
}

// A share is SSKR if it decodes as bytewords (the CRC has to check out) and the
// decoded bytes are at least a metadata header plus the minimum secret.
export const isShare = (share: string): boolean => {
  try {
    const bytes = fromHex(bytewords.decode(share, STANDARD))
    return bytes.length >= 5 + 16 // METADATA_SIZE_BYTES + MIN_SECRET_LEN
  } catch {
    return false
  }
}
