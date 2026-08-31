/**
 * Pin down the advanced-mode entropy quality assessment.
 *
 *   npx vite-node tools/check-entropy-quality.mjs
 *
 * assessEntropy answers two things the UI shows a user entering their own
 * entropy: is there ENOUGH (bit count reached), and is it any GOOD (a heuristic
 * that flags obviously non-random input). The quality part is a warning, never
 * a block, but a silent regression here would let "50 identical dice" look like
 * a strong seed, so the behaviour is worth freezing.
 *
 * The quantity side is checked against an independent oracle (bits = symbols
 * times bits-per-symbol). The quality side asserts the label on hand-picked
 * inputs whose character everyone can see: all-same and short repeats must trip,
 * pseudo-random input must not.
 */
import { assessEntropy } from "../src/helpers/entropyQuality.ts"

const failures = []
let checks = 0
const check = (ok, message) => {
  checks += 1
  if (!ok) failures.push(message)
}

const BITS_PER_SYMBOL = { 0: 4, 1: 1, 2: Math.log2(6), 3: Math.log2(10) }

// Deterministic pseudo-random dice, so the "good input" case is stable across
// runs without hand-crafting a string.
const dice = (n, seed) => {
  let s = seed
  const next = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  let out = ""
  for (let i = 0; i < n; i++) out += String(1 + Math.floor(next() * 6))
  return out
}

// --- Quantity: bits, enough, needMore against the oracle ---
const quantityCases = [
  { value: "3".repeat(50), typeId: 2, minBits: 128, enough: true }, // ~129 bits
  { value: "3".repeat(49), typeId: 2, minBits: 128, enough: false }, // ~126.7 bits
  { value: "", typeId: 2, minBits: 128, enough: false },
  { value: "a".repeat(32), typeId: 0, minBits: 128, enough: true }, // 128 bits
  { value: "a".repeat(31), typeId: 0, minBits: 128, enough: false }, // 124 bits
  { value: "1".repeat(128), typeId: 1, minBits: 128, enough: true },
  { value: "1".repeat(127), typeId: 1, minBits: 128, enough: false },
  { value: "7".repeat(39), typeId: 3, minBits: 128, enough: true }, // ~129.6 bits
  { value: "7".repeat(64), typeId: 0, minBits: 256, enough: true }, // 256 bits
]

for (const c of quantityCases) {
  const q = assessEntropy(c.value, c.typeId, c.minBits)
  const expectedBits = c.value.length * BITS_PER_SYMBOL[c.typeId]
  check(
    Math.abs(q.bits - expectedBits) < 1e-9,
    `bits for ${c.value.length} of type ${c.typeId}: got ${q.bits}, oracle ${expectedBits}`,
  )
  check(q.enough === c.enough, `enough for ${c.value.length} of type ${c.typeId}: got ${q.enough}, want ${c.enough}`)
  check(q.count === c.value.length, `count for type ${c.typeId}: got ${q.count}, want ${c.value.length}`)
  // needMore must close exactly the gap to minBits (0 once enough).
  const wantMore = c.enough ? 0 : Math.ceil((c.minBits - expectedBits) / BITS_PER_SYMBOL[c.typeId])
  check(q.needMore === wantMore, `needMore for type ${c.typeId}, len ${c.value.length}: got ${q.needMore}, want ${wantMore}`)
}

// --- Quality: the heuristic label ---
const qualityCases = [
  { value: "3".repeat(50), typeId: 2, weak: true, note: "all-same dice" },
  { value: "12".repeat(25), typeId: 2, weak: true, note: "two-symbol repeat" },
  { value: "123456".repeat(9), typeId: 2, weak: true, note: "period-6 repeat" },
  { value: "1".repeat(8) + "3524613542", typeId: 2, weak: true, note: "long leading run" },
  { value: "01".repeat(64), typeId: 1, weak: true, note: "alternating coin pattern" },
  { value: "0".repeat(128), typeId: 1, weak: true, note: "all-same coin" },
  { value: dice(60, 12345), typeId: 2, weak: false, note: "pseudo-random dice" },
  { value: dice(70, 99), typeId: 2, weak: false, note: "pseudo-random dice 2" },
  { value: "3141", typeId: 2, weak: false, note: "too short to judge (below 8)" },
]

for (const c of qualityCases) {
  const q = assessEntropy(c.value, c.typeId, 128)
  check(q.weak === c.weak, `weak for "${c.note}": got ${q.weak} (reason=${q.reason}), want ${c.weak}`)
  if (c.weak) check(typeof q.reason === "string" && q.reason.length > 0, `weak "${c.note}" must carry a reason`)
}

if (failures.length) {
  console.error(`FAIL: ${failures.length} of ${checks} checks failed:`)
  for (const f of failures) console.error("  - " + f)
  process.exit(1)
}
console.log(`OK: ${checks} checks passed, entropy quality assessment behaves`)
