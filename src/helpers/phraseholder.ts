import seedForm12 from "src/assets/pdf/SeedForm12.pdf"
import seedForm24 from "src/assets/pdf/SeedForm24.pdf"
import shareForm20 from "src/assets/pdf/ShareForm20.pdf"
import shareForm33 from "src/assets/pdf/ShareForm33.pdf"

import { mergePhraseholder } from "./mergePhraseholder"

// The forms are bundled as assets (inlined as data URIs in the single-file
// build), so fetch reads them from memory, no network. Which pair applies
// depends on the seed length: a 12-word seed splits into 20-word shares, a
// 24-word seed into 33-word shares.
const fetchBytes = (url: string) => fetch(url).then(r => r.arrayBuffer())

export const buildPhraseholder = async (
  selectedWordCount: number,
  sharesNumber: number,
): Promise<Blob> => {
  const is12 = selectedWordCount === 12
  const [seedBytes, shareBytes] = await Promise.all([
    fetchBytes(is12 ? seedForm12 : seedForm24),
    fetchBytes(is12 ? shareForm20 : shareForm33),
  ])
  const merged = await mergePhraseholder(seedBytes, shareBytes, sharesNumber)
  return new Blob([merged], { type: "application/pdf" })
}
