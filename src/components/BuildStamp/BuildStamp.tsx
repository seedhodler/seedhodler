import classes from "./BuildStamp.module.scss"

// Steht am Ende jeder Seite. Der Commit-Hash macht sichtbar, welcher Stand
// geladen ist; bei einem Werkzeug mit reproduzierbaren Builds ist das die
// Zeile, an der jemand sein Artefakt gegen einen bekannten Commit abgleicht.
//
// __BUILD_INFO__ ist ein Compile-Time-Define und wird im Produktions-Build
// durch den echten Commit ersetzt. Der Dev-Server wendet das Define nicht an
// (Zusammenspiel mit dem node-polyfills-Plugin), dort ist der Bezeichner also
// nicht deklariert. Der typeof-Guard faengt das ab, damit der Footer im Dev
// nicht mit einem ReferenceError wirft, sondern schlicht "dev" zeigt.
const BUILD_INFO = typeof __BUILD_INFO__ !== "undefined" ? __BUILD_INFO__ : { commit: "dev", date: "" }

const BuildStamp = () => {
  const { commit, date } = BUILD_INFO
  return (
    <footer className={classes.stamp} title={date ? `Commit vom ${date}` : undefined}>
      seedhodler · {commit}
    </footer>
  )
}

export default BuildStamp
