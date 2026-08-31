/**
 * Prove that this application still implements SPECIFICATION.md.
 *
 * The Python checker verifies that the frozen vectors are cryptographically
 * correct against third-party implementations. It says nothing about the app,
 * so on its own it would stay green while Seedhodler drifted away from its own
 * specification. This script closes that gap by driving the app's real helpers.
 *
 *   npx vite-node tools/check-app-conformance.mjs [--emit] > shares.json
 *
 * With --emit the freshly generated shares are written to stdout (all human
 * output goes to stderr) so that
 * check-external-recovery.py can recover them using nothing but SLIP-0039 and
 * BIP-39 reference code. That is the promise of section 10 of the
 * specification: the shares are recoverable without Seedhodler.
 */
// The app is built with vite-plugin-node-polyfills, which shims node:fs away.
// The vectors therefore come in as a JSON import and the emitted shares go to
// stdout rather than to a file.
import vectorFile from "../seedhodler-test-vectors.json"

import * as bip39 from "bip39"

import { mnemonicToEntropy } from "../src/helpers/bip39utils.ts"
import { getFormattedShares, restoreMnemonic, validateShare } from "../src/helpers/slip39utils.ts"

const { vectors } = vectorFile
const emit = process.argv.includes("--emit")

const failures = []
let checks = 0

const check = (ok, message) => {
  checks += 1
  if (!ok) failures.push(message)
}

/** Every t-sized subset of items, so recovery is proven for all of them. */
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

  // The app's mnemonic helpers read the wordlist from bip39's global default,
  // set during generation. The checker mirrors that: pick the vector's
  // language before decoding or re-encoding, exactly as the app does.
  bip39.setDefaultWordlist(v.language)

  // Section 4 step 1: the mnemonic must yield exactly the recorded entropy.
  check(
    mnemonicToEntropy(v.mnemonic) === v.entropy,
    `${label}: mnemonicToEntropy disagrees with the recorded entropy`,
  )

  check(v.shares.length === count, `${label}: expected ${count} shares, found ${v.shares.length}`)
  for (const [i, share] of v.shares.entries()) {
    check(validateShare(share), `${label}: recorded share ${i + 1} fails validateShare`)
  }

  // The regression guard. If anyone changes how the master secret relates to
  // the entropy, these frozen shares stop producing the frozen mnemonic, and
  // every share set ever written on paper becomes unreadable by this app.
  for (const subset of subsets(v.shares, threshold)) {
    const { mnemonic, error } = restoreMnemonic(subset)
    check(!error, `${label}: recovery from recorded shares failed: ${error}`)
    check(mnemonic === v.mnemonic, `${label}: recorded shares recovered a different mnemonic`)
  }

  // Splitting is not deterministic: SLIP-0039 draws a random identifier, so a
  // fresh split cannot be compared against the recorded shares word for word.
  // What must hold is that it round-trips and that the shares have the shape
  // section 7 requires.
  const masterSecret = Array.from(Buffer.from(v.entropy, "hex"))
  const fresh = getFormattedShares(masterSecret, "", 1, [[threshold, count]])

  check(fresh.length === count, `${label}: a fresh split produced ${fresh.length} shares`)
  const expectedWords = v.wordCount === 12 ? 20 : 33
  for (const [i, share] of fresh.entries()) {
    check(
      share.split(" ").length === expectedWords,
      `${label}: fresh share ${i + 1} has ${share.split(" ").length} words, expected ${expectedWords}`,
    )
  }
  const prefixes = new Set(fresh.map(s => s.split(" ").slice(0, 2).join(" ")))
  check(prefixes.size === 1, `${label}: shares of one set must share their first two words`)

  for (const subset of subsets(fresh, threshold)) {
    const { mnemonic, error } = restoreMnemonic(subset)
    check(!error, `${label}: recovery from a fresh split failed: ${error}`)
    check(mnemonic === v.mnemonic, `${label}: a fresh split does not round-trip`)
  }

  // Below the threshold nothing may come out.
  if (threshold > 1) {
    const { mnemonic, error } = restoreMnemonic(fresh.slice(0, threshold - 1))
    check(
      !!error && !mnemonic,
      `${label}: ${threshold - 1} shares recovered something, threshold is ${threshold}`,
    )
  }

  emitted.push({ id: v.id, scheme: v.scheme, language: v.language, entropy: v.entropy, mnemonic: v.mnemonic, shares: fresh })
}

if (failures.length) {
  console.error(`FAILED: ${failures.length} of ${checks} checks:`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}

console.error(`OK: ${checks} checks passed, the app matches SPECIFICATION.md`)

if (emit) {
  process.stdout.write(JSON.stringify({ generatedBy: "seedhodler", vectors: emitted }, null, 2))
}
