/**
 * Prove that the five advanced-mode entropy input types convert correctly.
 *
 *   npx vite-node tools/check-entropy-inputs.mjs
 *
 * A user in advanced mode supplies raw entropy as hex, binary, dice, decimal
 * digits, or drawn cards. getEntropyDetails turns each into the binary string that is
 * later split. A silent bug here means a seed that does not match what the user
 * entered, so the conversion is worth pinning down.
 *
 * Each case is checked against an independent oracle rather than against the
 * helper's own internals: the numeric value of the produced binary must equal
 * the value the digits stand for. Leading zero-padding does not change that
 * value, so the check is about the conversion, not the padding.
 */
import { getEntropyDetails } from "../src/helpers/getEntropyDetails.ts"

const failures = []
let checks = 0
const check = (ok, message) => {
  checks += 1
  if (!ok) failures.push(message)
}

// Cards: rank (A2-9TJQK) + suit (cdhs), index rank*4+suit, read as base 52.
// Parsed defensively into complete pairs, mirroring the helper.
const RANKS = "A23456789TJQK"
const SUITS = "cdhs"
const cardsOracle = v => {
  let n = 0n
  let i = 0
  while (i < v.length) {
    const r = RANKS.indexOf(v[i])
    if (r === -1) {
      i += 1
      continue
    }
    const s = i + 1 < v.length ? SUITS.indexOf(v[i + 1]) : -1
    if (s === -1) break
    n = n * 52n + BigInt(r * 4 + s)
    i += 2
  }
  return n
}

// Independent value of the digits under each input type.
const oracle = {
  0: v => (v === "" ? 0n : BigInt("0x" + v)), // hex
  1: v => (v === "" ? 0n : BigInt("0b" + v)), // binary, digits are already bits
  // dice: faces 1-6, where 6 stands for 0, read as a base-6 number.
  2: v => [...v].reduce((a, c) => a * 6n + BigInt(c === "6" ? 0 : Number(c)), 0n),
  3: v => (v === "" ? 0n : BigInt(v)), // decimal
  4: cardsOracle, // cards, base 52
}

const name = { 0: "hex", 1: "binary", 2: "dice", 3: "decimal", 4: "cards" }

// A deterministic run of valid cards, so the long conversion cases are stable
// without hand-typing dozens of rank/suit pairs.
const buildCards = (n, seed) => {
  let s = seed
  const next = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  let out = ""
  for (let i = 0; i < n; i++) out += RANKS[Math.floor(next() * 13)] + SUITS[Math.floor(next() * 4)]
  return out
}

// [type, value, minBits]
const cases = [
  [0, "00112233445566778899aabbccddeeff", 128],
  [0, "ff", 128],
  [0, "0001020304050607", 128],
  [0, "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f", 256],
  [1, "10101010111100001100110000110011", 128],
  [1, "1", 128],
  [2, "1234561234561234561234563451", 128],
  [2, "6666", 128], // all sixes stand for all zeros -> value 0
  [2, "5555555555555555555555555555555555555555555555555555", 256],
  [3, "123456789012345678901234567890", 128],
  [3, "1", 128],
  [4, "AsKh9d7cThQs2c", 128],
  [4, "AcAc", 128], // ace of clubs is index 0, so two of them stand for value 0
  [4, buildCards(30, 7), 128],
  [4, buildCards(50, 13), 256],
]

for (const [type, value, minBits] of cases) {
  const { selectedEntropyAsBinary, selectedEntropyDetails, regex } = getEntropyDetails(value, minBits, type)
  const got = selectedEntropyAsBinary === "" ? 0n : BigInt("0b" + selectedEntropyAsBinary)
  const want = oracle[type](value)
  check(got === want, `${name[type]} "${value.slice(0, 24)}": converted to ${got}, expected ${want}`)

  // The digits themselves must be accepted by the type's own validation regex,
  // and a plainly wrong character must be rejected.
  check(!regex.test(value), `${name[type]}: valid input "${value.slice(0, 12)}" rejected by its regex`)
  check(regex.test(value + "z"), `${name[type]}: regex accepts an out-of-alphabet character`)

  check(selectedEntropyDetails.totalBits > 0 || value === "", `${name[type]}: totalBits is zero for non-empty input`)
}

// Empty input must be a defined zero, never NaN or a throw.
for (const type of [0, 1, 2, 3, 4]) {
  const { selectedEntropyAsBinary } = getEntropyDetails("", 128, type)
  const v = selectedEntropyAsBinary === "" ? 0n : BigInt("0b" + selectedEntropyAsBinary)
  check(v === 0n, `${name[type]}: empty input did not yield zero`)
}

if (failures.length) {
  console.error(`FAILED: ${failures.length} of ${checks} checks:`)
  for (const f of failures) console.error("  - " + f)
  process.exit(1)
}
console.log(`OK: ${checks} checks passed, all five entropy input types convert correctly`)
