import { OPTIONS_NUMBER, slip39wordlist } from "src/constants/index"
import { getRandomInt, getUniqueArr } from "src/helpers"

// Build the multiple-choice options for one verification field: OPTIONS_NUMBER
// distractors drawn from the wordlist, with the correct words spliced in. The
// wordlist is scheme-specific (SLIP-39 words or SSKR bytewords) and defaults to
// SLIP-39 for existing callers.
export const getOptions = (idsToPaste: number[], wordlist: string[] = slip39wordlist) => {
  const ids = getUniqueArr(0, wordlist.length - 1, OPTIONS_NUMBER)

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

  return ids.map(id => ({ word: wordlist[id], wordNumber: id, selected: false }))
}
