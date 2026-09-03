// A standard 52-card deck as an entropy source. A card is a rank followed by a
// suit: ranks A 2 3 4 5 6 7 8 9 T J Q K (T = ten), suits c d h s (clubs,
// diamonds, hearts, spades). Written rank-then-suit, e.g. "As" = ace of spades,
// "Tc" = ten of clubs, "9h" = nine of hearts.
//
// Each drawn card is one of 52 symbols carrying log2(52) ~ 5.7 bits, and the
// sequence is read as a base-52 number, big-endian, exactly the way the dice
// input reads a base-6 number. HEX is a different thing entirely (16 symbols,
// 4 bits each): a deck of cards is not hexadecimal, which is why it is its own
// input type rather than the icon on the hex tile.

export const CARD_RANKS = "A23456789TJQK"
export const CARD_SUITS = "cdhs"
export const CARD_ALPHABET = 52

// Any character that is not a rank or a suit; used to gate the input field. It
// cannot enforce rank-then-suit order on its own, so cardsToIndices below stays
// defensive and only accepts complete, valid pairs.
export const cardsRegex = /[^A23456789TJQKcdhs]/

// Parse a raw string into complete card indices (0-51). Walks rank-then-suit and
// keeps only complete, valid pairs; a half-typed trailing card (a rank with no
// suit yet) is ignored until its suit arrives, and stray characters are skipped.
export const cardsToIndices = (value: string): number[] => {
  const indices: number[] = []
  let i = 0
  while (i < value.length) {
    const rank = CARD_RANKS.indexOf(value[i])
    if (rank === -1) {
      i += 1
      continue
    }
    const suit = i + 1 < value.length ? CARD_SUITS.indexOf(value[i + 1]) : -1
    if (suit === -1) break
    indices.push(rank * CARD_SUITS.length + suit)
    i += 2
  }
  return indices
}

// The number of complete cards entered so far (the symbol count for this type).
export const cardsCount = (value: string): number => cardsToIndices(value).length

// The card sequence read as a base-52 big-endian number. BigInt because a full
// 256-bit seed is ~45 cards, past Number's safe range.
export const cardsToBigInt = (value: string): bigint => {
  const base = BigInt(CARD_ALPHABET)
  let num = BigInt(0)
  for (const idx of cardsToIndices(value)) {
    num = num * base + BigInt(idx)
  }
  return num
}
