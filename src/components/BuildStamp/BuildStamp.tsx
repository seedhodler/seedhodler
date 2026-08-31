import { commit, date } from "virtual:build-info"

import classes from "./BuildStamp.module.scss"

// Steht am Ende jeder Seite. Der Commit-Hash macht sichtbar, welcher Stand
// geladen ist; bei einem Werkzeug mit reproduzierbaren Builds ist das die
// Zeile, an der jemand sein Artefakt gegen einen bekannten Commit abgleicht.
//
// commit/date kommen aus dem virtuellen Modul virtual:build-info (siehe
// vite.config.js). Ein echtes Modul, das in Dev und Build gleich aufgeloest
// wird, also traegt der Footer in beiden Faellen den echten Commit.
const BuildStamp = () => {
  return (
    <footer className={classes.stamp} title={date ? `Commit vom ${date}` : undefined}>
      seedhodler · {commit}
    </footer>
  )
}

export default BuildStamp
