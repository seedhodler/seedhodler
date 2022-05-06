import { cardDictionary } from "constants/index"
import { parseBigInt } from "helpers/index"

const getBinaryFromCardEntropy = (entropyValue: string) => {
  let resultBinary = ""

  const cardsArr = entropyValue.match(/.{1,2}/g)
  cardsArr?.forEach(card => {
    const cardAsBinary = cardDictionary[card.toLowerCase() as keyof typeof cardDictionary]
    if (card.length === 2 && cardAsBinary) {
      resultBinary += cardAsBinary
    }
  })

  return resultBinary
}

export const getEntropyDetails = (entropyValue: string, entropyTypeId: number, minBits: number) => {
  const regexVariants = {
    0: /[^0-1]/,
    2: /[^1-6]/,
    3: /[^0-9]/,
  }
  const regex = regexVariants[entropyTypeId as keyof typeof regexVariants]

  const entropiesAsBinary = {
    0: entropyValue,
    1: getBinaryFromCardEntropy(entropyValue),
    // TODO: temp condition to remove error when entering value for Number entropy
    // replace(/6/g, "0") - workaround to use 1-6 in dice, instead of 0-5
    2: entropyTypeId === 2 ? parseBigInt(entropyValue.replace(/6/g, "0") || "0", 6).toString(2) : "0",
    3: entropyTypeId === 3 ? BigInt(entropyValue).toString(2) : "0",
  }
  const selectedEntropyAsBinary = entropiesAsBinary[entropyTypeId as keyof typeof entropiesAsBinary]

  const entropyDetails = {
    0: {
      timeToCrack: "temp",
      totalBits: `${entropyValue.length} / ${minBits}`,
      entropyType: "Binary [0-1], 101010011",
      rawEntropyWords: "?",
    },
    1: {
      timeToCrack: "temp",
      totalBits: `${selectedEntropyAsBinary.length} / ${minBits}`,
      entropyType: "Card [A2-9TJQK][CDHS], ahqs9dtc",
      rawEntropyWords: "?",
    },
    2: {
      timeToCrack: "temp",
      totalBits: `${selectedEntropyAsBinary.length} / ${minBits}`,
      entropyType: "Dice [1-6], 25356341",
      rawEntropyWords: "?",
    },
    3: {
      timeToCrack: "temp",
      totalBits: `${selectedEntropyAsBinary.length} / ${minBits}`,
      entropyType: "Numbers [0-9], 90834528",
      rawEntropyWords: "?",
    },
  }
  const selectedEntropyDetails = entropyDetails[entropyTypeId as keyof typeof entropyDetails]

  return { selectedEntropyAsBinary, selectedEntropyDetails, regex }
}
