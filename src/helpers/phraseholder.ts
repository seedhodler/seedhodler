import seedForm12 from "src/assets/pdf/SeedForm12.pdf"
import seedForm24 from "src/assets/pdf/SeedForm24.pdf"
import shareForm20 from "src/assets/pdf/ShareForm20.pdf"
import shareForm25 from "src/assets/pdf/ShareForm25.pdf"
import shareForm33 from "src/assets/pdf/ShareForm33.pdf"
import shareForm41 from "src/assets/pdf/ShareForm41.pdf"

import { type Scheme } from "src/core"

import { mergePhraseholder } from "./mergePhraseholder"

// The forms are bundled as assets (inlined as data URIs in the single-file
// build), so fetch reads them from memory, no network. Which share form applies
// depends on the seed length and the scheme: a 12-word seed splits into 20-word
// SLIP-39 shares or 25-byteword SSKR shares, a 24-word seed into 33-word or
// 41-byteword shares. The seed form is the same BIP-39 seed either way, so only
// the share form is scheme-specific.
const fetchBytes = (url: string) => fetch(url).then(r => r.arrayBuffer())

export const buildPhraseholder = async (
  selectedWordCount: number,
  sharesNumber: number,
  scheme: Scheme = "slip39",
): Promise<Blob> => {
  const is12 = selectedWordCount === 12
  const seedForm = is12 ? seedForm12 : seedForm24
  const shareForm =
    scheme === "sskr" ? (is12 ? shareForm25 : shareForm41) : is12 ? shareForm20 : shareForm33
  const [seedBytes, shareBytes] = await Promise.all([fetchBytes(seedForm), fetchBytes(shareForm)])
  const merged = await mergePhraseholder(seedBytes, shareBytes, sharesNumber)
  return new Blob([merged], { type: "application/pdf" })
}
