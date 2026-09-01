import custodyInsert from "src/assets/pdf/CustodyInsert.pdf"
import custodyOverview from "src/assets/pdf/CustodyOverview.pdf"
import emergencyGuide from "src/assets/pdf/EmergencyGuide.pdf"
import seedForm12 from "src/assets/pdf/SeedForm12.pdf"
import seedForm24 from "src/assets/pdf/SeedForm24.pdf"
import shareForm20 from "src/assets/pdf/ShareForm20.pdf"
import shareForm25 from "src/assets/pdf/ShareForm25.pdf"
import shareForm33 from "src/assets/pdf/ShareForm33.pdf"
import shareForm41 from "src/assets/pdf/ShareForm41.pdf"
import verificationLog from "src/assets/pdf/VerificationLog.pdf"
import walletProfile from "src/assets/pdf/WalletProfile.pdf"

import { type Scheme } from "src/core"

import { type FormItem, mergeForms } from "./mergeForms"

// The blank forms to print. Bundled as assets (inlined as data URIs in the
// single-file build), so fetch reads them from memory, no network. A given split
// matches exactly two seed/share forms: the seed form for its length, and the
// share form for its length and scheme. The others stay available (free choice)
// but the UI marks them as not matching. Inserts (kind "insert") are optional
// add-ons that fit any split, e.g. the custody slip that goes with each envelope.
export type FormKey =
  | "seed12"
  | "seed24"
  | "share20"
  | "share33"
  | "share25"
  | "share41"
  | "custodyInsert"
  | "walletProfile"
  | "verificationLog"
  | "custodyOverview"
  | "emergencyGuide"

export type FormMeta = {
  key: FormKey
  url: string
  kind: "seed" | "share" | "insert"
  wordCount?: 12 | 24 // seed/share forms only
  scheme?: Scheme // share forms only
  perEnvelope?: boolean // default a copy per share (envelope) rather than one
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
  { key: "custodyInsert", url: custodyInsert, kind: "insert", perEnvelope: true, label: "Custody insert", detail: "one A5 slip to keep with each sealed envelope" }, // prettier-ignore
  { key: "walletProfile", url: walletProfile, kind: "insert", label: "Wallet profile", detail: "one sheet per wallet: path, address type, fingerprint, check address" }, // prettier-ignore
  { key: "verificationLog", url: verificationLog, kind: "insert", label: "Verification log", detail: "table for the periodic checks of each storage location" }, // prettier-ignore
  { key: "custodyOverview", url: custodyOverview, kind: "insert", label: "Custody overview", detail: "the single map of which wallet is kept where (keep one copy, in the safe)" }, // prettier-ignore
  { key: "emergencyGuide", url: emergencyGuide, kind: "insert", label: "Emergency and inheritance guide", detail: "two pages: how an heir recovers the wallets" }, // prettier-ignore
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
