import { printingEnabled } from "virtual:build-info"

// Build-time switch. The offline build (VITE_NOPRINT=1) hides every print
// option, because on the air-gapped Seedhodler OS printing is unreliable and
// the blank forms carry no secret (they can be printed on any normal printer).
// The default online build keeps printing. Sourced from the build-info virtual
// module so it resolves identically in the dev server and the production build.
export const PRINTING_ENABLED = printingEnabled

// The offline live OS: signed Seedhodler OS images that boot straight into this
// app on an air-gapped machine. One source of truth for every link to it.
export const SEEDHODLER_OS_RELEASES_URL = "https://github.com/seedhodler/seedhodler-os/releases"
