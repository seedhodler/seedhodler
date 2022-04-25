import React, { useState } from "react"

import variables from "styles/Variables.module.scss"
import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { Button } from "components/Button"
import { Select } from "components/Select"
// import { SelectNew } from "components/SelectNew"
import { Input } from "components/Input"
import { Calc } from "components/Calc"
import { Switch } from "components/Switch"

type Props = {}

const HomePage: React.FC<Props> = () => {
  const [inputValue, setInputValue] = useState("Some value")
  const [checked, setChecked] = useState(false)

  return (
    <div
      style={{
        // width: "100%",
        height: "100%",
        backgroundColor: "green",
      }}
    >
      {/* <Button iconRight={ArrowRightIcon} style={{ marginBottom: "1rem" }}>
        Ok! Got it
      </Button> */}
      {/* <Select style={{ marginBottom: "1rem" }} /> */}
      {/* <SelectNew /> */}
      {/* <Input
        count={1}
        value={inputValue}
        onChange={setInputValue}
        variants={["final", "fact", "fence", "forest"]}
      /> */}
      {/* <Calc value={2} onPlus={() => {}} onMinus={() => {}} /> */}
      {/* <Switch checked={checked} onChange={setChecked} /> */}
      dsad
    </div>
  )
}

export default HomePage
