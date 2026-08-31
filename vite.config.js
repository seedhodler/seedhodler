import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteSingleFile } from 'vite-plugin-singlefile'
import svgr from "vite-plugin-svgr"

export default defineConfig(() => ({
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