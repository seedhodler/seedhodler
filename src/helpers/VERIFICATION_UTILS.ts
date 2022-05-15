import { slip39wordlist } from "constants/index"

const OPTIONS_NUMBER = 14

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getUniqueArr = (min: number, max: number, arrLength: number) => {
  if (arrLength > max - min) {
    throw new Error("arrLength must be greater (not enough space for elements between min and max)")
  }

  const ids = []

  do {
    const generatedId = getRandomInt(min, max)
    if (ids.indexOf(generatedId) === -1) {
      ids.push(generatedId)
    }
  } while (ids.length < arrLength)

  return ids
}

export const getOptions = (idsToPaste: number[]) => {
  const ids = getUniqueArr(0, slip39wordlist.length - 1, OPTIONS_NUMBER)

  const usedIndexes: number[] = []
  idsToPaste.forEach(idToPaste => {
    if (ids.indexOf(idToPaste) === -1) {
      let indexToPaste
      do {
        indexToPaste = getRandomInt(0, OPTIONS_NUMBER - 1)
      } while (usedIndexes.includes(indexToPaste))

      ids[indexToPaste] = idToPaste
      usedIndexes.push(indexToPaste)
    } else {
      usedIndexes.push(ids.indexOf(idToPaste))
    }
  })

  return ids.map(id => ({ word: slip39wordlist[id], wordNumber: id, selected: false }))
}
