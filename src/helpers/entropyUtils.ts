export const binaryStrToEntropyArray = (binaryStr: string) => {
  const entropyArray = []
  for (let i = 0; i < binaryStr.length / 8; i++) {
    const byteAsBits = binaryStr.substring(i * 8, i * 8 + 8)
    const entropyByte = parseInt(byteAsBits, 2)
    entropyArray.push(entropyByte)
  }
  return entropyArray
}
