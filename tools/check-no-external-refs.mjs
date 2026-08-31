/**
 * Prueft, dass das ausgelieferte Dokument nichts von aussen nachlaedt.
 *
 * Frueher genuegte dafuer ein grep nach "https://" in index.html. Seit dem
 * Single-File-Build steht das ganze Bundle in dieser Datei, und darin stehen
 * URLs als Zeichenketten: React nennt reactjs.org in seinen Fehlermeldungen,
 * eine Bibliothek nennt ihre Lizenzseite, der Hilfetext verlinkt Wikipedia.
 * Geladen wird nichts davon. Ein grep wuerde ab jetzt Unsinn pruefen.
 *
 * Geprueft wird deshalb, was das Dokument tatsaechlich laedt: die Attribute,
 * ueber die ein Browser eine Ressource holt.
 *
 *   node tools/check-no-external-refs.mjs build/index.html
 */
import { readFileSync } from "node:fs"

const [, , file = "build/index.html"] = process.argv
const html = readFileSync(file, "utf8")

const problems = []

// src= und href= an ladenden Elementen. <a href> ist ausgenommen: ein Link,
// den jemand anklickt, ist eine Navigation, kein automatischer Abruf.
for (const m of html.matchAll(/<(script|link|img|source|video|audio|iframe|embed|object|track)\b([^>]*)>/gi)) {
  const [, tag, attrs] = m
  for (const a of attrs.matchAll(/\b(src|href|data)\s*=\s*"([^"]*)"/gi)) {
    const url = a[2]
    if (/^(data:|blob:|#|$)/i.test(url)) continue
    if (/^[a-z]+:\/\//i.test(url) || url.startsWith("//")) {
      problems.push(`${tag} ${a[1]}="${url.slice(0, 80)}" — laedt von aussen`)
    } else {
      problems.push(`${tag} ${a[1]}="${url}" — laedt eine zweite Datei nach`)
    }
  }
}

// @import und url() in inline-CSS
for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
  for (const u of m[1].matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) {
    if (!/^(data:|blob:)/i.test(u[1])) problems.push(`css url(${u[1].slice(0, 60)})`)
  }
  for (const i of m[1].matchAll(/@import\s+['"]([^'"]+)['"]/gi)) problems.push(`css @import ${i[1]}`)
}

if (problems.length) {
  console.error(`FEHLER: ${file} laedt ${problems.length} Ressource(n) nach:`)
  for (const p of problems) console.error("  - " + p)
  process.exit(1)
}
console.log(`OK: ${file} laedt nichts nach, weder von aussen noch aus einer zweiten Datei`)
