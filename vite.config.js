import { execSync } from "node:child_process"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteSingleFile } from 'vite-plugin-singlefile'
import svgr from "vite-plugin-svgr"

// Ein sichtbarer Stempel, damit ein Nutzer weiss, welchen Build er geladen hat.
// Bei einem Werkzeug, dessen Vertrauensargument reproduzierbare Builds sind,
// gehoert die Version an die Oberflaeche.
//
// Bewusst KEIN new Date(): ein Wanduhr-Zeitstempel wuerde zwei Builds desselben
// Commits unterscheidbar machen und die Reproduzierbarkeit brechen. Verwendet
// wird das Commit-Datum, das pro Commit fest ist.
//
// Quelle in dieser Reihenfolge: eine gesetzte Umgebungsvariable (so bekommt der
// Container-Build die Info, dort fehlt .git), sonst git, sonst ein Fallback.
function buildInfo() {
  const git = (cmd, fallback) => {
    try { return execSync(cmd, { encoding: "utf8" }).trim() }
    catch { return fallback }
  }
  const commit = process.env.SEEDHODLER_COMMIT
    ? process.env.SEEDHODLER_COMMIT.slice(0, 7)
    : git("git rev-parse --short HEAD", "unknown") +
      (git("git status --porcelain", "") ? "-dirty" : "")
  const date = process.env.SEEDHODLER_COMMIT_DATE || git("git show -s --format=%cI HEAD", "")
  return { commit, date }
}

// The build stamp reaches the app through a virtual module instead of a define.
// A define is a plain text substitution that vite-plugin-node-polyfills quietly
// skips in the dev server, so the identifier stayed unreplaced there and the
// footer could not show the commit. A virtual module is a real module the
// bundler resolves the same way in dev and in the production build, so both
// modes carry the real commit.
function buildInfoPlugin() {
  const virtualId = "virtual:build-info"
  const resolvedId = "\0" + virtualId
  return {
    name: "seedhodler-build-info",
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    load(id) {
      if (id === resolvedId) {
        const info = buildInfo()
        // The offline build (VITE_NOPRINT=1) hides every print option: on the
        // air-gapped Seedhodler OS printing is unreliable, and the blank forms
        // carry no secret, so they are printed on a normal printer instead. The
        // default (online) build keeps printing. Routed through the same virtual
        // module as the build stamp so it resolves the same in dev and build.
        const printingEnabled = process.env.VITE_NOPRINT !== "1"
        return (
          `export const commit = ${JSON.stringify(info.commit)}\n` +
          `export const date = ${JSON.stringify(info.date)}\n` +
          `export const printingEnabled = ${JSON.stringify(printingEnabled)}\n`
        )
      }
    },
  }
}

export default defineConfig(() => ({
  base: "./",
  build: {
    outDir: "build",
    // Alles in eine Datei: kein Nachladen, also nichts, was offline fehlen kann.
    assetsInlineLimit: 100 * 1024 * 1024,
    cssCodeSplit: false,
  },
  plugins: [
    buildInfoPlugin(),
    react(),
    svgr(),
    nodePolyfills(),
    viteSingleFile()
  ],
  resolve: {
    alias: {
      src: "/src",
    },
  },
}))