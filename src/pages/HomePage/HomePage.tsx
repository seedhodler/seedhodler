import React, { useState } from "react"

import GenerateIcon from "assets/icons/GenerateWithBg.svg"
import RestoreIcon from "assets/icons/RestoreWithBg.svg"
import InfoGrayIcon from "assets/icons/InfoGray.svg"

import classes from "./HomePage.module.scss"
import { Tab } from "./components/Tab"
import { SelectNew } from "components/SelectNew"
import { Switch } from "components/Switch"
import { Button } from "components/Button"
import { Input } from "components/Input"
import { BadgeTitle } from "./components/BadgeTitle"

type Props = {}

const HomePage: React.FC<Props> = () => {
  const [activeTabId, setActiveTabId] = useState(0)
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [isDetails, setIsDetails] = useState(false)
  const [temp, setTemp] = useState("")

  const langOptions = [{ value: "english", label: "English" }]
  const wordCountOptions = [
    { value: "12", label: "12" },
    { value: "24", label: "24" },
  ]

  const tempArr = [
    "sadsadsa",
    "qsdadqq",
    "wwfxvcxzvw",
    "ecxvcxbee",
    "rrrnvbnbvn",
    "fftretref",
    "dsadas",
    "dsadsad",
    "dsadsa",
    "wqeqwe",
    "cxzcxzc",
    "qwqeqwe",
  ]
  // const tempArr = ["1"]
  let count = 0

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
          <BadgeTitle title="Phrase" additionalInfo="BIP 39" />
          <div className={classes.configContainer}>
            <div className={classes.language}>
              <div className={classes.selectLabelContainer}>
                <p className={classes.selectLabel}>Language</p>
                <img src={InfoGrayIcon} alt="Info" />
              </div>
              <SelectNew options={langOptions} />
            </div>
            <div className={classes.language}>
              <div className={classes.selectLabelContainer}>
                <p className={classes.selectLabel}>Word Count</p>
                <img src={InfoGrayIcon} alt="Info" />
              </div>
              <SelectNew options={wordCountOptions} />
            </div>
          </div>
          <div className={classes.configContainer}>
            <div className={classes.configLabelContainer}>
              <p>
                Advanced Toolset - <span className={classes.entropyGeneration}>Entropy Generation</span>
              </p>
              <img src={InfoGrayIcon} alt="Info" style={{ marginLeft: "0.5rem" }} />
            </div>
            <Switch checked={isAdvanced} onChange={setIsAdvanced} />
          </div>
          <div className={classes.configContainer} style={{ marginBottom: "1.6rem" }}>
            <p>Show entropy details</p>
            <Switch checked={isDetails} onChange={setIsDetails} />
          </div>
          <div className={classes.blockDivider}></div>
          <Button className={classes.generateBtn}>Generate Phrase</Button>
          <div className={classes.blockLabelContainer} style={{ marginBottom: "1.4rem" }}>
            <p style={{ marginRight: "0.5rem" }}>BIP39 Seed Phrase</p>
            <img src={InfoGrayIcon} alt="Info" />
          </div>
          <div className={classes.seedPhraseContainer}>
            {tempArr.map(item => (
              <Input
                count={++count}
                value={item}
                onChange={setTemp}
                containerStyle={{ width: "47%", marginBottom: "1.2rem" }}
              />
            ))}
          </div>
          <BadgeTitle title="Split Phrase into shares" />
          <p className={classes.sharesInfo}>
            The generated Phrase can now be split into up to 6 different shares. These can then be combined to
            restore your Phrase
          </p>
        </div>
      ) : (
        <div className={classes.tabContent}>Tab Restore Content</div>
      )}
    </>
  )
}

export default HomePage
