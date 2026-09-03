export const langOptions = [
  { value: "english", label: "English" },
  { value: "czech", label: "Czech" },
  { value: "chinese_simplified", label: "Simplified Chinese" },
  { value: "chinese_traditional", label: "Traditional Chinesse" },
  { value: "korean", label: "Korean" },
  { value: "french", label: "French" },
  { value: "italian", label: "Italian" },
  { value: "spanish", label: "Spanish" },
  { value: "japanese", label: "Japanese" },
  { value: "portuguese", label: "Portuguese" },
]

export const wordCountOptions = [
  { value: "12", label: "12" },
  { value: "24", label: "24" },
]

// On restore, the number of words on a share fully determines both the scheme
// and the seed size, so it is the only control needed:
//   20 -> SLIP-39 128-bit, 33 -> SLIP-39 256-bit
//   25 -> SSKR 128-bit,    41 -> SSKR 256-bit
export const shareWordCountOptions = [
  { value: "20", label: "20" },
  { value: "25", label: "25" },
  { value: "33", label: "33" },
  { value: "41", label: "41" },
]

// SSKR first: it is the default share scheme. SLIP-39 stays as a compatibility
// option. The values match the crypto core's Scheme type.
export const schemeOptions = [
  { value: "sskr", label: "SSKR" },
  { value: "slip39", label: "SLIP-39" },
]
