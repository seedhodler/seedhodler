export const getRandomInt = (min: number, max: number) => {
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
