// Two questions the advanced entropy input has to answer honestly:
//
//   1. Do I have ENOUGH entropy yet? The app counts bits, but a user rolling
//      dice thinks in throws. Bits are the honest security unit, so we keep them,
//      but we also report the count in the unit the user is actually producing
//      and how many more of those are needed.
//
//   2. Is the entropy any GOOD? Bit COUNT says nothing about quality: 50 dice all
//      showing the same face is 128 "bits" by the counter yet trivially guessable.
//      We flag obviously weak input with a heuristic. It is a warning, not a hard
//      block: a heuristic cannot certify randomness, and a genuinely random run
//      can look unusual, so the user stays in control.
//
// Kept as a pure function so the checker can pin the behaviour down.

import { cardsToIndices } from "./cards"

// Bits carried by one symbol of each entropy type, and a human name for it, so
// the UI can speak in throws/flips/chars/digits instead of only raw bits.
type TypeMeta = { bitsPerSymbol: number; unit: string; alphabet: number; charsPerSymbol: number }

const TYPE_META: Record<number, TypeMeta> = {
  0: { bitsPerSymbol: 4, unit: "hex chars", alphabet: 16, charsPerSymbol: 1 },
  1: { bitsPerSymbol: 1, unit: "flips", alphabet: 2, charsPerSymbol: 1 },
  2: { bitsPerSymbol: Math.log2(6), unit: "throws", alphabet: 6, charsPerSymbol: 1 },
  3: { bitsPerSymbol: Math.log2(10), unit: "digits", alphabet: 10, charsPerSymbol: 1 },
  // A card is two characters (rank + suit) but one symbol out of 52.
  4: { bitsPerSymbol: Math.log2(52), unit: "cards", alphabet: 52, charsPerSymbol: 2 },
}

// Split raw input into its symbols: one character each for hex/binary/dice/
// decimal, one rank+suit card each for the cards type (complete pairs only).
const toSymbols = (value: string, entropyTypeId: number): string[] =>
  entropyTypeId === 4 ? cardsToIndices(value).map(String) : value.split("")

// The fewest symbols of a type that carry at least minBits: the point the input
// should fill to and then stop. For hex and binary the symbols divide minBits
// evenly; for dice, decimal and cards they do not, so this rounds up to the
// symbol that first reaches enough (e.g. 50 dice throws for 128 bits, ~129 bits).
export const symbolsForMinBits = (entropyTypeId: number, minBits: number): number => {
  const meta = TYPE_META[entropyTypeId] ?? TYPE_META[0]
  return Math.ceil(minBits / meta.bitsPerSymbol)
}

// The same cap expressed in characters, since a card is two characters. The
// input field truncates to this so it fills to just past minBits and stops.
export const maxInputChars = (entropyTypeId: number, minBits: number): number => {
  const meta = TYPE_META[entropyTypeId] ?? TYPE_META[0]
  return symbolsForMinBits(entropyTypeId, minBits) * meta.charsPerSymbol
}

export type EntropyAssessment = {
  bits: number // true bit count (not yet floored, so the UI decides how to show it)
  unit: string // "throws", "flips", "hex chars", "digits"
  count: number // symbols entered
  needMore: number // symbols still needed to reach minBits (0 once enough)
  enough: boolean // count carries at least minBits
  weak: boolean // the randomness heuristic tripped
  reason?: string // why it is considered weak, for the UI
}

// A block repeated many times, e.g. "121212" or "123456123456". High symbol
// diversity can otherwise mask an obvious pattern (counting up over and over
// uses every symbol evenly), so catch any period that tiles the whole string at
// least three times. Three-plus identical blocks essentially never occur in
// random input, so this does not fire on genuine entropy.
const isRepeatedBlock = (s: string[]): boolean => {
  const n = s.length
  const maxPeriod = Math.floor(n / 3)
  for (let p = 1; p <= maxPeriod; p++) {
    if (n % p !== 0) continue
    let tiles = true
    for (let i = p; i < n; i++) {
      if (s[i] !== s[i % p]) {
        tiles = false
        break
      }
    }
    if (tiles) return true
  }
  return false
}

export const assessEntropy = (
  value: string,
  entropyTypeId: number,
  minBits: number,
): EntropyAssessment => {
  const meta = TYPE_META[entropyTypeId] ?? TYPE_META[0]
  // One symbol per character for most types; one per rank+suit card for cards.
  const symbols = toSymbols(value, entropyTypeId)
  const count = symbols.length
  const bits = count * meta.bitsPerSymbol
  const needMore = Math.max(0, Math.ceil((minBits - bits) / meta.bitsPerSymbol))
  const enough = bits >= minBits

  let weak = false
  let reason: string | undefined

  // Only judge quality once there is enough length to judge; below that we stay
  // quiet rather than nag while the user is still entering values.
  if (count >= 8) {
    // Plain object and index loops rather than Map/for-of iterators: the app's
    // TS target is below ES2015, where iterating a Map is a compile error.
    const counts: Record<string, number> = {}
    for (let i = 0; i < symbols.length; i++) {
      const ch = symbols[i]
      counts[ch] = (counts[ch] ?? 0) + 1
    }

    // Shannon entropy of the symbol distribution against the maximum for this
    // alphabet. Catches all-same (ratio 0) and a dominant or too-few symbols.
    let h = 0
    for (const key in counts) {
      const p = counts[key] / count
      h -= p * Math.log2(p)
    }
    const maxH = Math.log2(meta.alphabet)
    const ratio = maxH > 0 ? h / maxH : 1

    // Longest run of one repeated symbol, e.g. "000000".
    let longestRun = 1
    let run = 1
    for (let i = 1; i < symbols.length; i++) {
      run = symbols[i] === symbols[i - 1] ? run + 1 : 1
      if (run > longestRun) longestRun = run
    }

    if (ratio < 0.6) {
      weak = true
      reason = "low symbol diversity"
    } else if (longestRun >= Math.max(6, count / 3)) {
      weak = true
      reason = "a long run of one value"
    } else if (isRepeatedBlock(symbols)) {
      weak = true
      reason = "a repeating pattern"
    }
  }

  return { bits, unit: meta.unit, count, needMore, enough, weak, reason }
}
