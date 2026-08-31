import React from "react"
import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"

import "./styles/Global.scss"
import App from "./App"

// HashRouter, nicht BrowserRouter. Aus einer Datei geoeffnet ist der Pfad
// /home/.../seedhodler.html, keine Route passt, und die Auffangregel in
// Routes.tsx schickt den Nutzer auf "/" - unter file:// das Wurzelverzeichnis
// der Festplatte. Die App navigiert sich damit selbst von der Seite. Der Hash
// haelt die Route im Fragment und laesst den Pfad in Ruhe.
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)

