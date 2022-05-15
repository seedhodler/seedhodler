import { slip39wordlist, OPTIONS_NUMBER } from "constants/index"
import { getRandomInt, getUniqueArr } from "helpers"

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
