// Low-level byte conversions the BIP-39 and SLIP-39 wrappers share. No crypto of
// their own, kept here so both modules and the facade draw from one place.

export const hexStringToByteArray = (hexString: string): number[] => {
  const result: number[] = []
  for (let i = 0; i < hexString.length; i += 2) {
    result.push(parseInt(hexString.substring(i, i + 2), 16))
  }
  return result
}

export const binaryStrToEntropyArray = (binaryStr: string): number[] => {
  const entropyArray: number[] = []
  for (let i = 0; i < binaryStr.length / 8; i++) {
    const byteAsBits = binaryStr.substring(i * 8, i * 8 + 8)
    entropyArray.push(parseInt(byteAsBits, 2))
  }
  return entropyArray
}
