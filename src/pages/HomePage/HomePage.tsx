import React from "react"

import variables from "styles/Variables.module.scss"
import { Button } from "components/Button"
import { Select } from "components/Select"
import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { SelectNew } from "components/SelectNew"

type Props = {}

const HomePage: React.FC<Props> = () => {
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
        backgroundColor: variables.colorBg100,
      }}
    >
      <Button iconRight={ArrowRightIcon} style={{ marginBottom: "1rem" }}>
        Ok! Got it
      </Button>
      <Select style={{ marginBottom: "1rem" }} />
      <SelectNew />
    </div>
  )
}

export default HomePage
