import { Dispatch, SetStateAction } from "react"

export const binaryStrToEntropyArray = (binaryStr: string) => {
  const entropyArray = []
  for (let i = 0; i < binaryStr.length / 8; i++) {
    const byteAsBits = binaryStr.substring(i * 8, i * 8 + 8)

    const entropyByte = parseInt(byteAsBits, 2)

    entropyArray.push(entropyByte)
  }

  return entropyArray
}

export const hexStringToByteArray = (hexString: string) => {
  const result = []
  for (let i = 0; i < hexString.length; i += 2) {
    result.push(parseInt(hexString.substring(i, i + 2), 16))
  }
  return result
}

const shuffle = (array: number[]) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

export const getEntropyFromMouse = (
  e: MouseEvent,
  minBits: 128 | 256,
  entropy: number[],
  setIsMouseCapture: Dispatch<SetStateAction<boolean>>,
  setEntropyValue: Dispatch<SetStateAction<string>>,
  setMousePercentage: Dispatch<SetStateAction<number>>,
) => {
  console.log(entropy)

  const MAX_LEN = minBits // size of entropy's array
  if (entropy.length >= MAX_LEN) return
  const now = Date.now()
  if (now >= 1 && now % 10 !== 0) return
  // if (!isMouseCapture) {
  //   return
  // }
  const iw = window.innerWidth
  const ih = window.innerHeight
  const iwPlusIh = iw + ih
  const px = e.pageX
  const py = e.pageY
  const pxPlusPy = px + py
  const ret = Math.round(pxPlusPy / iwPlusIh)
  entropy.push(ret)

  const percentage = Math.floor((entropy.length / minBits) * 100)
  const roundToNearest10 = Math.ceil(percentage / 10) * 10
  setMousePercentage(roundToNearest10)

  if (entropy.length >= MAX_LEN) {
    shuffle(entropy)
    setIsMouseCapture(false)
    setEntropyValue(entropy.join(""))
  }
}
