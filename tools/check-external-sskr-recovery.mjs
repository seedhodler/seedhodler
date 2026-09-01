/**
 * Recover the app's SSKR shares without Seedhodler, using the canonical
 * Blockchain Commons reference `bc-seedtool`.
 *
 *   SEEDTOOL="docker run --rm seedtool-cli" node tools/check-external-sskr-recovery.mjs sskr-shares.json
 *
 * This is the SSKR counterpart to check-external-recovery.py: it proves the
 * promise that shares written on paper are recoverable by third-party code if
 * Seedhodler disappears. It reads the shares emitted by check-sskr.mjs --emit,
 * feeds a threshold-sized subset of each set to seedtool, and asserts the
 * recovered master secret equals the recorded BIP-39 entropy.
 *
 * One bridge is required: `seedtool --in sskr` decodes bytewords and then wants
 * a CBOR tag-309 wrapper (d9 0135 + byte string) around the raw share. Our tool
 * emits bytewords of the bare BCR-2020-011 share, so each share is re-wrapped
 * here before it goes to seedtool. SEEDTOOL is the seedtool invocation: a bare
 * binary ("seedtool") or a wrapper such as "docker run --rm seedtool-cli".
 */
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"

import bytewordsMod from "@ngraveio/bc-ur/dist/bytewords.js"

const bytewords = bytewordsMod.default ?? bytewordsMod
const STANDARD = bytewords.STYLES.STANDARD
const SEEDTOOL = (process.env.SEEDTOOL || "seedtool").trim().split(/\s+/)

// Wrap a bare BCR-2020-011 share (as our bytewords) in CBOR tag 309, the form
// seedtool requires, and re-encode as bytewords.
const toSeedtoolShare = ourBytewords => {
  const raw = Buffer.from(bytewords.decode(ourBytewords, STANDARD), "hex")
  const header =
    raw.length < 24
      ? Buffer.from([0xd9, 0x01, 0x35, 0x40 | raw.length])
      : Buffer.from([0xd9, 0x01, 0x35, 0x58, raw.length])
  return bytewords.encode(Buffer.concat([header, raw]).toString("hex"), STANDARD)
}

const file = process.argv[2]
if (!file) {
  console.error("usage: check-external-sskr-recovery.mjs <sskr-shares.json>")
  process.exit(2)
}

const { vectors } = JSON.parse(readFileSync(file, "utf8"))

const failures = []
let checks = 0

for (const v of vectors) {
  const [threshold] = v.scheme.split("-of-").map(Number)
  const subset = v.shares.slice(0, threshold).map(toSeedtoolShare)
  checks += 1
  let recovered
  try {
    recovered = execFileSync(SEEDTOOL[0], [...SEEDTOOL.slice(1), "--in", "sskr", ...subset], {
      encoding: "utf8",
    })
      .trim()
      .toLowerCase()
  } catch (err) {
    failures.push(`set ${v.id}: seedtool failed: ${(err.stderr || err.message || "").toString().trim()}`)
    continue
  }
  if (recovered !== v.entropy.toLowerCase()) {
    failures.push(`set ${v.id}: seedtool recovered ${recovered}, expected entropy ${v.entropy}`)
  }
}

if (failures.length) {
  console.error(`FAILED: ${failures.length} of ${checks} SSKR sets not recovered by bc-seedtool:`)
  for (const f of failures) console.error("  - " + f)
  process.exit(1)
}
console.error(`OK: bc-seedtool recovered all ${checks} SSKR share sets — recoverable without Seedhodler`)
