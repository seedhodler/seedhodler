import React, { useState } from "react"

import CoinIcon from "assets/icons/Coin.svg"
import CardsIcon from "assets/icons/Cards.svg"
import DiceIcon from "assets/icons/Dice.svg"
import NumbersIcon from "assets/icons/Numbers.svg"
import InfoGrayIcon from "assets/icons/InfoGray.svg"
import { Button } from "components/Button"
import { Calc } from "components/Calc"
import { InfoTitle } from "components/InfoTitle"
import { Input } from "components/Input"
import { SelectNew } from "components/SelectNew"
import { Switch } from "components/Switch"
import { Textarea } from "components/Textarea"

import { BadgeTitle } from "../BadgeTitle"
import classes from "./GenerateContent.module.scss"
import { EntropyValueType } from "../EntropyValueType"

const GenerateContent: React.FC = () => {
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [isDetails, setIsDetails] = useState(false)
  const [thresholdValue, setThresholdValue] = useState(3)
  const [sharesValue, setSharesValue] = useState(6)
  const [manualEntropy, setManualEntropy] = useState("")
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
  let count = 0

  return (
    <div className={classes.tabContent}>
      <BadgeTitle title="Phrase" additionalInfo="BIP 39" color="success" />
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
            Advanced Toolset -{" "}
            <span className={classes.entropyGeneration}>
              {isAdvanced ? "Careful, extremely dangerous when used incorrectly 🔥" : "Entropy Generation"}
            </span>
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
      {isAdvanced && (
        <>
          <BadgeTitle title="Entropy Generation" style={{ marginBottom: "2.6rem" }} />
          <div className={classes.entropyContainer}>
            <div>
              <InfoTitle title="Entropy Value Type" />
              <div className={classes.entropyOptionsContainer}>
                <EntropyValueType title="Coin Flip" subtitle="[1,2]" icon={CoinIcon} />
                <EntropyValueType title="Card" subtitle="[A2-9TJQK[CDHS]" icon={CardsIcon} />
                <EntropyValueType title="Dice" subtitle="[1-6]" icon={DiceIcon} />
                <EntropyValueType title="Numbers" subtitle="[0-9]" icon={NumbersIcon} />
              </div>
            </div>
            <div>
              <InfoTitle title="Mouse" />
              <Button>Start calculation</Button>
            </div>
          </div>
          <div className={classes.infoAndValidation}>
            <InfoTitle title="Manual - Enter your own entropy" />
            <div className={classes.validation}>Valid Entropy</div>
          </div>
          <Textarea value={manualEntropy} onChange={setManualEntropy} style={{ marginBottom: "3.4rem" }} />
        </>
      )}

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
      <BadgeTitle title="Split Phrase into shares" color="success" />
      <p className={classes.sharesInfo}>
        The generated Phrase can now be split into up to 6 different shares. These can then be combined to
        restore your Phrase
      </p>
      <div className={classes.thresholdSharesContainer}>
        <div className={classes.calcContainer}>
          <InfoTitle title="Threshold" className={classes.calcTitle} />
          <Calc
            value={thresholdValue}
            onPlus={() => setThresholdValue(prev => (prev >= 6 ? prev : ++prev))}
            onMinus={() => setThresholdValue(prev => (prev <= 0 ? prev : --prev))}
          />
        </div>
        <div className={classes.calcContainer}>
          <InfoTitle title="Shares" className={classes.calcTitle} />
          <Calc
            value={sharesValue}
            onPlus={() => setSharesValue(prev => (prev >= 6 ? prev : ++prev))}
            onMinus={() => setSharesValue(prev => (prev <= 0 ? prev : --prev))}
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
  )
}

export default GenerateContent
