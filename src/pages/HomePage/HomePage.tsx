import React, { useState } from "react"

import GenerateIcon from "assets/icons/GenerateWithBg.svg"
import RestoreIcon from "assets/icons/RestoreWithBg.svg"
import InfoGrayIcon from "assets/icons/InfoGray.svg"
import { SelectNew } from "components/SelectNew"
import { Switch } from "components/Switch"
import { Button } from "components/Button"
import { Input } from "components/Input"
import { Calc } from "components/Calc"
import { InfoTitle } from "components/InfoTitle"

import classes from "./HomePage.module.scss"
import { Tab } from "./components/Tab"
import { BadgeTitle } from "./components/BadgeTitle"

const HomePage: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(0)
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [isDetails, setIsDetails] = useState(false)
  const [thresholdValue, setThresholdValue] = useState(3)
  const [sharesValue, setSharesValue] = useState(6)
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
            <div>
              <InfoTitle title="Language" />
              <SelectNew options={langOptions} />
            </div>
            <div>
              <InfoTitle title="Word Count" />
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
          <Button fullWidth style={{ marginBottom: "3.4rem" }}>
            Generate Phrase
          </Button>
          <InfoTitle title="BIP39 Seed Phrase" />
          <div className={classes.seedPhraseContainer}>
            {tempArr.map((item, index) => (
              <Input
                key={item}
                count={++count}
                value={item}
                onChange={setTemp}
                containerStyle={{
                  width: "49%",
                  marginBottom: "1.2rem",
                  alignSelf: index >= 6 ? "flex-end" : "flex-start",
                  // alignSelf: index >= wordCount / 2 ? "flex-end" : "flex-start",
                }}
              />
            ))}
          </div>
          <BadgeTitle title="Split Phrase into shares" />
          <p className={classes.sharesInfo}>
            The generated Phrase can now be split into up to 6 different shares. These can then be combined to
            restore your Phrase
          </p>
          <div className={classes.thresholdSharesContainer}>
            <div className={classes.calcContainer}>
              <InfoTitle title="Threshold" className={classes.calcTitle} />
              <Calc
                value={thresholdValue}
                onPlus={() => setThresholdValue(prev => ++prev)}
                onMinus={() => setThresholdValue(prev => --prev)}
              />
            </div>
            <div className={classes.calcContainer}>
              <InfoTitle title="Shares" className={classes.calcTitle} />
              <Calc
                value={sharesValue}
                onPlus={() => setSharesValue(prev => ++prev)}
                onMinus={() => setSharesValue(prev => --prev)}
              />
            </div>
          </div>
          <Button fullWidth disabled style={{ marginBottom: "6.5rem" }}>
            Split
          </Button>
          <Button fullWidth disabled>
            Export / Save Shares
          </Button>
        </div>
      ) : (
        <div className={classes.tabContent}>Tab Restore Content</div>
      )}
    </>
  )
}

export default HomePage
