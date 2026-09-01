/**
 * Prove the app's SSKR path matches the specification, mirroring the SLIP-39
 * conformance check.
 *
 *   npx vite-node tools/check-sskr.mjs [--emit] > sskr-shares.json
 *
 * SSKR (Blockchain Commons) is the second share scheme. The same BIP-39 entropy
 * that SLIP-39 splits is the SSKR master secret; only the encoding differs
 * (bytewords, not SLIP-39 words). This drives the real core facade: split each
 * frozen vector with scheme "sskr", check the share shape, round-trip through
 * recovery, confirm below-threshold fails, and confirm the two schemes never
 * cross-validate. With --emit the fresh SSKR shares go to stdout so an
 * independent reference (bc-seedtool) can recover them without Seedhodler.
 */
import * as bip39 from "bip39"

import vectorFile from "../seedhodler-test-vectors.json"
import { detectScheme, recoverSeed, splitSeed, validateShare } from "../src/core/index.ts"
import { isShare } from "../src/core/sskr.ts"

const { vectors } = vectorFile
const emit = process.argv.includes("--emit")

const failures = []
let checks = 0
const check = (ok, message) => {
  checks += 1
  if (!ok) failures.push(message)
}

/** Every t-sized subset, so recovery is proven for all of them. */
function subsets(items, size) {
  if (size === 0) return [[]]
  if (items.length < size) return []
  const [head, ...rest] = items
  return [...subsets(rest, size - 1).map(s => [head, ...s]), ...subsets(rest, size)]
}

const emitted = []

for (const v of vectors) {
  const [threshold, count] = v.scheme.split("-of-").map(Number)
  const label = `set ${v.id} (${v.scheme}, ${v.wordCount} words, ${v.language})`

  // recoverSeed re-encodes the entropy with bip39's global default wordlist;
  // pick the vector's language so a recovered mnemonic matches the recorded one.
  bip39.setDefaultWordlist(v.language)

  const shares = splitSeed(v.mnemonic, { scheme: "sskr", threshold, shares: count })

  check(shares.length === count, `${label}: a fresh SSKR split produced ${shares.length} shares`)

  // Bytewords STANDARD: 25 words for a 16-byte secret (12-word seed), 41 for 32.
  const expectedWords = v.wordCount === 12 ? 25 : 41
  for (const [i, share] of shares.entries()) {
    const words = share.split(" ")
    check(
      words.length === expectedWords,
      `${label}: SSKR share ${i + 1} has ${words.length} words, expected ${expectedWords}`,
    )
    check(
      words.every(w => w.length === 4),
      `${label}: SSKR share ${i + 1} has a non-four-letter byteword`,
    )
    check(isShare(share), `${label}: SSKR share ${i + 1} fails isShare`)
  }

  check(detectScheme(shares) === "sskr", `${label}: a set of SSKR shares is not detected as sskr`)

  // Round-trip: every threshold-sized subset recovers the exact seed.
  for (const subset of subsets(shares, threshold)) {
    const result = recoverSeed(subset)
    check(!result.error, `${label}: SSKR recovery failed: ${result.error}`)
    check(
      "mnemonic" in result && result.mnemonic === v.mnemonic,
      `${label}: a fresh SSKR split does not round-trip`,
    )
  }

  // Below the threshold, nothing may come out.
  if (threshold > 1) {
    const result = recoverSeed(shares.slice(0, threshold - 1))
    check(
      !!result.error,
      `${label}: ${threshold - 1} SSKR shares recovered something, threshold is ${threshold}`,
    )
  }

  // Cross-scheme: the two encodings never validate as each other, and a mixed
  // set must fail loudly rather than half-recover.
  const slip39Shares = splitSeed(v.mnemonic, { scheme: "slip39", threshold, shares: count })
  check(!validateShare(shares[0]), `${label}: an SSKR share validated as a SLIP-39 share`)
  check(!isShare(slip39Shares[0]), `${label}: a SLIP-39 share validated as an SSKR share`)
  check(
    detectScheme([shares[0], slip39Shares[0]]) === null,
    `${label}: a mixed SSKR/SLIP-39 set was not rejected`,
  )
  check(
    !!recoverSeed([shares[0], slip39Shares[1], shares[2]]).error,
    `${label}: a mixed share set recovered something`,
  )

  emitted.push({ id: v.id, scheme: v.scheme, language: v.language, entropy: v.entropy, mnemonic: v.mnemonic, shares })
}

if (failures.length) {
  console.error(`FAILED: ${failures.length} of ${checks} checks:`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}

console.error(`OK: ${checks} checks passed, the app's SSKR path matches the specification`)

if (emit) {
  process.stdout.write(JSON.stringify({ generatedBy: "seedhodler", scheme: "sskr", vectors: emitted }, null, 2))
}
