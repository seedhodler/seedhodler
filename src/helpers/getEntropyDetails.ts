import { parseBigInt } from "helpers/index"

export const getEntropyDetails = (entropyValue: string, minBits: number, entropyTypeId: number = 0) => {
  const regexVariants = {
    0: /[^0-9a-fA-F]/,
    1: /[^0-1]/,
    2: /[^1-6]/,
    3: /[^0-9]/,
  }
  const regex = regexVariants[entropyTypeId as keyof typeof regexVariants]

  const entropiesAsBinary = {
    0: entropyTypeId === 0 ? BigInt(`0x${entropyValue || "0"}`).toString(2) : "0",
    1: entropyValue,
    // replace(/6/g, "0") - workaround to use 1-6 in dice, instead of 0-5
    2: entropyTypeId === 2 ? parseBigInt(entropyValue.replace(/6/g, "0") || "0", 6).toString(2) : "0",
    3: entropyTypeId === 3 ? BigInt(entropyValue).toString(2) : "0",
  }
  const rawEntropyBinaryString = entropiesAsBinary[entropyTypeId as keyof typeof entropiesAsBinary]
  const entropyLength = entropyValue.length

  const entropyDetails = {
    0: {
      totalBits: entropyLength * 4,
      entropyType: "HEX [0-9A-F], 4B2A16",
    },
    1: {
      totalBits: entropyLength,
      entropyType: "Binary [0-1], 101010011",
    },
    2: {
      totalBits: entropyLength * Math.log2(6),
      entropyType: "Dice [1-6], 25356341",
    },
    3: {
      totalBits: entropyLength * Math.log2(10),
      entropyType: "Numbers [0-9], 90834528",
    },
  }
  const selectedEntropyDetails = entropyDetails[entropyTypeId as keyof typeof entropyDetails]
  const entropyBits = Math.min(minBits, Math.ceil(selectedEntropyDetails.totalBits))
  const entropyPrefix = "0".repeat(Math.max(0, entropyBits - rawEntropyBinaryString.length))
  const selectedEntropyAsBinary = entropyPrefix + rawEntropyBinaryString

  return {
    selectedEntropyAsBinary,
    selectedEntropyDetails,
    regex,
  }
}
