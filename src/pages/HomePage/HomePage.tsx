import React, { useState } from "react"

import GenerateIcon from "assets/icons/GenerateWithBg.svg"
import RestoreIcon from "assets/icons/RestoreWithBg.svg"

import variables from "styles/Variables.module.scss"
import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { Button } from "components/Button"
import { Select } from "components/Select"
// import { SelectNew } from "components/SelectNew"
import { Input } from "components/Input"
import { Calc } from "components/Calc"
import { Switch } from "components/Switch"

import classes from "./HomePage.module.scss"
import { Tab } from "./components/Tab"

type Props = {}

const HomePage: React.FC<Props> = () => {
  const [activeTabId, setActiveTabId] = useState(0)
  const [inputValue, setInputValue] = useState("Some value")
  const [checked, setChecked] = useState(false)

  return (
    <>
      <div className={classes.tabsContainer}>
        <Tab
          title="Generate"
          icon={GenerateIcon}
          active={activeTabId === 0}
          onClick={() => setActiveTabId(0)}
        />
        <Tab
          title="Restore"
          icon={RestoreIcon}
          active={activeTabId === 1}
          onClick={() => setActiveTabId(1)}
        />
      </div>
      {activeTabId === 0 ? (
        <div className={classes.tabContent}>
          <div className={classes.badgeContainer}>
            <div className={classes.badge}></div>
            <span className={classes.title}>Phrase</span>
            <span className={classes.bipInfo}>BIP 39</span>
          </div>
        </div>
      ) : (
        <div className={classes.tabContent}>Tab Restore Content</div>
      )}
    </>
  )
}

export default HomePage
