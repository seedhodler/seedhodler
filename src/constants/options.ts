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

// SSKR first: it is the default share scheme. SLIP-39 stays as a compatibility
// option. The values match the crypto core's Scheme type.
export const schemeOptions = [
  { value: "sskr", label: "SSKR" },
  { value: "slip39", label: "SLIP-39" },
]
