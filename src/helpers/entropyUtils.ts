export const binaryStrToEntropyArray = (binaryStr: string) => {
  const entropyArray = []
  for (let i = 0; i < binaryStr.length / 8; i++) {
    const byteAsBits = binaryStr.substring(i * 8, i * 8 + 8)
    // console.log("byteAsBits -", byteAsBits)

    const entropyByte = parseInt(byteAsBits, 2)
    // console.log("entropyByte -", entropyByte)

    entropyArray.push(entropyByte)
  }
  // console.log(entropyArray)

  return entropyArray
}
