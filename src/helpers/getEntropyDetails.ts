import { cardDictionary } from "constants/index"
import { parseBigInt } from "helpers/index"

const cardDictionaryLength = Object.keys(cardDictionary).length

const getBinaryFromCardEntropy = (entropyValue: string) => {
  let result = BigInt(0)

  const cardsArr = entropyValue.match(/.{1,2}/g)
  cardsArr?.forEach(card => {
    const cardAsBinary = cardDictionary[card.toLowerCase() as keyof typeof cardDictionary]
    if (card.length === 2 && cardAsBinary) {
      result = BigInt(cardDictionaryLength) * result + BigInt(cardAsBinary)
    }
  })

  return result.toString(2)
}

export const getEntropyDetails = (entropyValue: string, minBits: number, entropyTypeId: number = 0) => {
  const regexVariants = {
    0: /[^0-1]/,
    1: /[^aA2-9tTjJqQkKcCdDhHsS]|(?<=[cCdDhHsS])[cCdDhHsS]|(?<=[aA2-9tTjJqQkK])[aA2-9tTjJqQkK]/,
    2: /[^1-6]/,
    3: /[^0-9]/,
  }
  const regex = regexVariants[entropyTypeId as keyof typeof regexVariants]

  const entropiesAsBinary = {
    0: entropyValue,
    1: getBinaryFromCardEntropy(entropyValue),
    // replace(/6/g, "0") - workaround to use 1-6 in dice, instead of 0-5
    2: entropyTypeId === 2 ? parseBigInt(entropyValue.replace(/6/g, "0") || "0", 6).toString(2) : "0",
    3: entropyTypeId === 3 ? BigInt(entropyValue).toString(2) : "0",
  }
  const rawEntropyBinaryString = entropiesAsBinary[entropyTypeId as keyof typeof entropiesAsBinary]
  const entropyLength = entropyValue.length

  const entropyDetails = {
    0: {
      totalBits: entropyLength,
      entropyType: "Binary [0-1], 101010011",
    },
    1: {
      // TODO: either remove this or add precise usage instructions
      totalBits: Math.floor(0.5 * entropyLength) * Math.log2(cardDictionaryLength),
      entropyType: "Card [A2-9TJQK][CDHS], ahqs9dtc",
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
