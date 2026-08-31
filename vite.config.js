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

export default defineConfig(() => ({
  define: {
    __BUILD_INFO__: JSON.stringify(buildInfo()),
  },
  base: "./",
  build: {
    outDir: "build",
    // Alles in eine Datei: kein Nachladen, also nichts, was offline fehlen kann.
    assetsInlineLimit: 100 * 1024 * 1024,
    cssCodeSplit: false,
  },
  plugins: [
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