import classes from "./BuildStamp.module.scss"

// Steht am Ende jeder Seite. Der Commit-Hash macht sichtbar, welcher Stand
// geladen ist; bei einem Werkzeug mit reproduzierbaren Builds ist das die
// Zeile, an der jemand sein Artefakt gegen einen bekannten Commit abgleicht.
const BuildStamp = () => {
  const { commit, date } = __BUILD_INFO__
  return (
    <footer className={classes.stamp} title={date ? `Commit vom ${date}` : undefined}>
      seedhodler · {commit}
    </footer>
  )
}

export default BuildStamp
