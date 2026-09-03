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
// First-page preview images, rendered from the PDFs, shown as a thumbnail and
// hover preview in the print dialog. They are pictures of the blank forms only,
// so they carry no secret. Regenerate after changing a PDF with:
//   pdftocairo -png -singlefile -scale-to-x 1400 -scale-to-y -1 \
//     src/assets/pdf/<Form>.pdf src/assets/pdf/previews/<key>
// (bundled as data URIs in the single-file build, ~1.7 MB total; high enough
// resolution to stay sharp in the ~440px preview pane on high-DPI screens.)
import custodyInsertPreview from "src/assets/pdf/previews/custodyInsert.png"
import custodyOverviewPreview from "src/assets/pdf/previews/custodyOverview.png"
import emergencyGuidePreview from "src/assets/pdf/previews/emergencyGuide.png"
import seed12Preview from "src/assets/pdf/previews/seed12.png"
import seed24Preview from "src/assets/pdf/previews/seed24.png"
import share20Preview from "src/assets/pdf/previews/share20.png"
import share25Preview from "src/assets/pdf/previews/share25.png"
import share33Preview from "src/assets/pdf/previews/share33.png"
import share41Preview from "src/assets/pdf/previews/share41.png"
import verificationLogPreview from "src/assets/pdf/previews/verificationLog.png"
import walletProfilePreview from "src/assets/pdf/previews/walletProfile.png"

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
  preview: string // first-page preview image (data URI in the single-file build)
  kind: "seed" | "share" | "insert"
  wordCount?: 12 | 24 // seed/share forms only
  scheme?: Scheme // share forms only
  perEnvelope?: boolean // default a copy per share (envelope) rather than one
  pages?: number // PDF page count, for the print summary; defaults to 1
  label: string
  detail: string
}

export const FORMS: FormMeta[] = [
  { key: "seed12", url: seedForm12, preview: seed12Preview, kind: "seed", wordCount: 12, label: "Master Seed form", detail: "12 words, BIP-39" }, // prettier-ignore
  { key: "seed24", url: seedForm24, preview: seed24Preview, kind: "seed", wordCount: 24, label: "Master Seed form", detail: "24 words, BIP-39" }, // prettier-ignore
  { key: "share20", url: shareForm20, preview: share20Preview, kind: "share", wordCount: 12, scheme: "slip39", label: "Share form", detail: "20 words, SLIP-39" }, // prettier-ignore
  { key: "share25", url: shareForm25, preview: share25Preview, kind: "share", wordCount: 12, scheme: "sskr", label: "Share form", detail: "25 words, SSKR" }, // prettier-ignore
  { key: "share33", url: shareForm33, preview: share33Preview, kind: "share", wordCount: 24, scheme: "slip39", label: "Share form", detail: "33 words, SLIP-39" }, // prettier-ignore
  { key: "share41", url: shareForm41, preview: share41Preview, kind: "share", wordCount: 24, scheme: "sskr", label: "Share form", detail: "41 words, SSKR" }, // prettier-ignore
  // Insert order is the listing (and print) order the product wants.
  { key: "emergencyGuide", url: emergencyGuide, preview: emergencyGuidePreview, kind: "insert", pages: 2, label: "Emergency and inheritance guide", detail: "Two pages on how an heir recovers the wallets" }, // prettier-ignore
  { key: "custodyOverview", url: custodyOverview, preview: custodyOverviewPreview, kind: "insert", label: "Custody overview", detail: "The one map of which wallet is kept where (keep a single copy in the safe)" }, // prettier-ignore
  { key: "custodyInsert", url: custodyInsert, preview: custodyInsertPreview, kind: "insert", perEnvelope: true, label: "Custody insert", detail: "One A5 slip for each sealed envelope" }, // prettier-ignore
  { key: "walletProfile", url: walletProfile, preview: walletProfilePreview, kind: "insert", label: "Wallet profile", detail: "One sheet per wallet: path, address type, fingerprint, check address" }, // prettier-ignore
  { key: "verificationLog", url: verificationLog, preview: verificationLogPreview, kind: "insert", label: "Verification log", detail: "A table to log each periodic storage check" }, // prettier-ignore
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
