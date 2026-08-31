/**
 * Erzeugt die nginx-Header-Datei fuer das gebaute Artefakt.
 *
 * Seit dem Single-File-Build ist die ganze App ein inline <script>. Eine
 * Policy mit script-src 'self' verbietet das und laesst die Seite leer. Der
 * naheliegende Ausweg waere 'unsafe-inline' — der macht die Policy fuer
 * Skripte aber wertlos, und genau bei einem Werkzeug fuer Seeds ist sie das
 * Letzte, was man aufgeben will.
 *
 * Stattdessen wird jedes Inline-Skript gehasht und sein sha256 in die Policy
 * geschrieben. Aendert sich das Bundle, aendert sich der Hash, und die Datei
 * wird beim naechsten Build neu erzeugt.
 *
 *   node tools/make-csp.mjs build/index.html build/security-headers.conf
 */
import { createHash } from "node:crypto"
import { readFileSync, writeFileSync } from "node:fs"

const [, , inPath = "build/index.html", outPath = "build/security-headers.conf"] = process.argv
const html = readFileSync(inPath, "utf8")

// Inline-Skripte sind die ohne src-Attribut. Gehasht wird der Rumpf, exakt so
// wie er im Dokument steht.
const hashes = []
for (const m of html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
  hashes.push(`'sha256-${createHash("sha256").update(m[1], "utf8").digest("base64")}'`)
}
if (hashes.length === 0) throw new Error(`keine Inline-Skripte in ${inPath} gefunden`)

const csp = [
  "default-src 'self'",
  `script-src 'self' 'wasm-unsafe-eval' blob: ${hashes.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "worker-src 'self' blob:",
  "connect-src 'self' data: blob:",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "object-src 'none'",
].join("; ")

writeFileSync(outPath, `# Erzeugt von tools/make-csp.mjs. Nicht von Hand aendern.
#
# Die Policy beschreibt die tatsaechliche Netzoberflaeche der App. Sie ist leer:
# jede Quelle ist 'self', die Seite kann keinen Dritten erreichen, auch dann
# nicht, wenn eine Abhaengigkeit es versucht. data: und blob: stehen dort, wo
# die App ihre eigenen Ressourcen im Browser baut, unter anderem das PDF.
#
# ${hashes.length} Inline-Skript(e) per sha256 erlaubt statt per 'unsafe-inline'.

add_header Content-Security-Policy "${csp}" always;
add_header Referrer-Policy "no-referrer" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), usb=(), serial=()" always;
`)
console.log(`${outPath}: ${hashes.length} Inline-Skript(e) gehasht`)
