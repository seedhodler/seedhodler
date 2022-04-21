import React from "react"

import { Button } from "components/Button"
import ArrowRightIcon from "assets/icons/ArrowRight.svg"

const App: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "500px",
        height: "400px",
        margin: "auto auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button iconRight={ArrowRightIcon}>Ok! Got it</Button>
    </div>
  )
}

export default App
