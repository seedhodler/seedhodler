import seedForm12 from "src/assets/pdf/SeedForm12.pdf"
import seedForm24 from "src/assets/pdf/SeedForm24.pdf"
import shareForm20 from "src/assets/pdf/ShareForm20.pdf"
import shareForm25 from "src/assets/pdf/ShareForm25.pdf"
import shareForm33 from "src/assets/pdf/ShareForm33.pdf"
import shareForm41 from "src/assets/pdf/ShareForm41.pdf"

import { type Scheme } from "src/core"

import { type FormItem, mergeForms } from "./mergeForms"

// The blank forms to print. Bundled as assets (inlined as data URIs in the
// single-file build), so fetch reads them from memory, no network. A given split
// matches exactly two: the seed form for its length, and the share form for its
// length and scheme. The others stay available (free choice) but the UI marks
// them as not matching the current split.
export type FormKey = "seed12" | "seed24" | "share20" | "share33" | "share25" | "share41"

export type FormMeta = {
  key: FormKey
  url: string
  kind: "seed" | "share"
  wordCount: 12 | 24
  scheme?: Scheme // share forms only
  label: string
  detail: string
}

export const FORMS: FormMeta[] = [
  { key: "seed12", url: seedForm12, kind: "seed", wordCount: 12, label: "Seed form", detail: "12 words, BIP-39" },
  { key: "seed24", url: seedForm24, kind: "seed", wordCount: 24, label: "Seed form", detail: "24 words, BIP-39" },
  { key: "share20", url: shareForm20, kind: "share", wordCount: 12, scheme: "slip39", label: "Share form", detail: "20 words, SLIP-39" }, // prettier-ignore
  { key: "share25", url: shareForm25, kind: "share", wordCount: 12, scheme: "sskr", label: "Share form", detail: "25 bytewords, SSKR" }, // prettier-ignore
  { key: "share33", url: shareForm33, kind: "share", wordCount: 24, scheme: "slip39", label: "Share form", detail: "33 words, SLIP-39" }, // prettier-ignore
  { key: "share41", url: shareForm41, kind: "share", wordCount: 24, scheme: "sskr", label: "Share form", detail: "41 bytewords, SSKR" }, // prettier-ignore
]

// The seed form and share form that match the current split (seed length and
// scheme). Everything else is a valid form but does not fit what was generated.
export const matchingFormKeys = (wordCount: number, scheme: Scheme): FormKey[] => {
  const seed: FormKey = wordCount === 12 ? "seed12" : "seed24"
  const share = FORMS.find(f => f.kind === "share" && f.wordCount === wordCount && f.scheme === scheme)
  return share ? [seed, share.key] : [seed]
}

export type FormSelection = { key: FormKey; copies: number }

const fetchBytes = (url: string) => fetch(url).then(r => r.arrayBuffer())

// Build one PDF from the chosen forms, each repeated `copies` times, in the
// order given. Order and copies come straight from the print dialog.
export const buildForms = async (selection: FormSelection[]): Promise<Blob> => {
  const items: FormItem[] = await Promise.all(
    selection.map(async ({ key, copies }) => {
      const form = FORMS.find(f => f.key === key)
      if (!form) throw new Error(`unknown form ${key}`)
      return { bytes: await fetchBytes(form.url), copies }
    }),
  )
  const merged = await mergeForms(items)
  return new Blob([merged], { type: "application/pdf" })
}
