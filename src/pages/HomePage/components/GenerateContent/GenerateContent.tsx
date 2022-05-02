import React, { useEffect, useState } from "react"

import CoinIcon from "assets/icons/Coin.svg"
import CardsIcon from "assets/icons/Cards.svg"
import DiceIcon from "assets/icons/Dice.svg"
import NumbersIcon from "assets/icons/Numbers.svg"
import InfoGrayIcon from "assets/icons/InfoGray.svg"
import { Button } from "components/Button"
import { Calc } from "components/Calc"
import { InfoTitle } from "components/InfoTitle"
import { Input } from "components/Input"
import { Select } from "components/Select"
import { Switch } from "components/Switch"
import { Textarea } from "components/Textarea"
import { generateMnemonic, generateMnemonicFromEntropy } from "helpers"
import { langOptions, wordCountOptions } from "constants/options"

import { BadgeTitle } from "../BadgeTitle"
import { EntropyValueType } from "../EntropyValueType"
import { ColorOptions } from "../BadgeTitle/BadgeTitle"
import classes from "./GenerateContent.module.scss"

const GenerateContent: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState(langOptions[0].value)
  const [selectedWordCount, setSelectedWordCount] = useState(wordCountOptions[0].value)
  const [mnemonic, setMnemonic] = useState(new Array(12).fill(""))
  const [isAdvanced, setIsAdvanced] = useState(true)
  const [isDetails, setIsDetails] = useState(true)
  const [entropyTypeId, setEntropyTypeId] = useState(0)
  const [entropyValue, setEntropyValue] = useState("")
  const [thresholdValue, setThresholdValue] = useState(3)
  const [sharesValue, setSharesValue] = useState(6)

  let count = 0
  const isGenerateBtnDisabled = isAdvanced
    ? +selectedWordCount === 12
      ? entropyValue.length < 128
      : entropyValue.length < 256
    : false

  const handleGeneratePhase = () => {
    let mnemonic
    if (isAdvanced) {
      mnemonic = generateMnemonicFromEntropy(selectedLang, entropyValue)
    } else {
      mnemonic = generateMnemonic(selectedLang, +selectedWordCount)
    }
    const mnemonicArr = mnemonic.split(" ")
    setMnemonic(mnemonicArr)
  }

  useEffect(() => {
    setMnemonic(new Array(+selectedWordCount).fill(""))
  }, [selectedWordCount])

  return (
    <div className={classes.tabContent}>
      <BadgeTitle title="Phrase" additionalInfo="BIP 39" color={ColorOptions.Success} />
      <div className={classes.configContainer}>
        <div>
          <InfoTitle title="Language" />
          <Select defaultValue={selectedLang} onChange={setSelectedLang} options={langOptions} />
        </div>
        <div>
          <InfoTitle title="Word Count" />
          <Select
            defaultValue={selectedWordCount}
            onChange={setSelectedWordCount}
            options={wordCountOptions}
          />
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
                <EntropyValueType
                  title="Coin Flip"
                  subtitle="[1,2]"
                  isActive={entropyTypeId === 0}
                  onClick={() => setEntropyTypeId(0)}
                  icon={CoinIcon}
                />
                <EntropyValueType
                  title="Card"
                  subtitle="[A2-9TJQK[CDHS]"
                  isActive={entropyTypeId === 1}
                  onClick={() => setEntropyTypeId(1)}
                  icon={CardsIcon}
                />
                <EntropyValueType
                  title="Dice"
                  subtitle="[1-6]"
                  isActive={entropyTypeId === 2}
                  onClick={() => setEntropyTypeId(2)}
                  icon={DiceIcon}
                />
                <EntropyValueType
                  title="Numbers"
                  subtitle="[0-9]"
                  isActive={entropyTypeId === 3}
                  onClick={() => setEntropyTypeId(3)}
                  icon={NumbersIcon}
                />
              </div>
            </div>
            <div>
              <InfoTitle title="Mouse" />
              <Button onClick={() => {}}>Start calculation</Button>
            </div>
          </div>
          <div className={classes.infoAndValidation}>
            <InfoTitle title="Manual - Enter your own entropy" />
            <div className={classes.validation}>Valid Entropy</div>
          </div>
          <Textarea
            value={entropyValue}
            onChange={setEntropyValue}
            // regExp={/[^0-1]/}
            maxBitsValue={+selectedWordCount === 12 ? 128 : 256}
            style={{ marginBottom: "3.4rem" }}
          />
        </>
      )}
      {isDetails && (
        <>
          <div style={{ backgroundColor: "red", color: "white", padding: "3rem", marginBottom: "3rem" }}>
            {entropyTypeId === 2 && (
              <>
                Entered base6 in base10: {parseInt(entropyValue, 6)}
                <br />
                Entered base6 in binary: {parseInt(entropyValue, 6).toString(2)}
                <br />
                Bits: {parseInt(entropyValue, 6).toString(2).length}
              </>
            )}
            {entropyTypeId === 3 && (
              <>
                Entered base10 value: {entropyValue}
                <br />
                Entered base10 in binary: {(+entropyValue).toString(2)}
                <br />
                Bits: {(+entropyValue).toString(2).length}
              </>
            )}
          </div>
          <BadgeTitle title="Entropy details" color={ColorOptions.Error} />
          <p className={classes.insightsLabel}>Here are more insights into your manual input</p>
          <div className={classes.insightsContainer}>
            <div className={classes.insightBlock}>
              <p className={classes.insightTitle}>Time to Crack</p>
              <div className={classes.insightContentContainer}>
                <span className={classes.insightBadge}>Centuries</span>
                <p className={classes.insightContent}>Repeats like "aaa" are easy to guess</p>
              </div>
            </div>
            <div className={classes.insightBlock}>
              <p className={classes.insightTitle}>Total Bits</p>
              <p className={classes.insightContent}>{entropyValue.length}</p>
            </div>
            <div className={classes.insightBlock}>
              <p className={classes.insightTitle}>Entropy Type</p>
              <p className={classes.insightContent}>Binary [0-1] , 101010011</p>
            </div>
            <div className={classes.insightBlock}>
              <p className={classes.insightTitle}>Raw Entropy Words</p>
              <p className={classes.insightContent}>15</p>
            </div>
          </div>
        </>
      )}
      <Button
        fullWidth
        style={{ marginBottom: "3.4rem" }}
        onClick={handleGeneratePhase}
        disabled={isGenerateBtnDisabled}
      >
        Generate Phrase
      </Button>
      <InfoTitle title="BIP39 Seed Phrase" />
      <div
        className={classes.seedPhraseContainer}
        style={{ height: selectedWordCount === "12" ? "360px" : "720px" }}
      >
        {mnemonic.map((word, index) => (
          <Input
            key={index}
            count={++count}
            index={index}
            value={word}
            onChange={setMnemonic}
            containerStyle={{
              width: "49%",
              marginBottom: "1.2rem",
              alignSelf: index >= +selectedWordCount / 2 ? "flex-end" : "flex-start",
            }}
          />
        ))}
      </div>
      {mnemonic.every(word => word.length !== 0) && (
        <>
          <BadgeTitle title="Split Phrase into shares" color={ColorOptions.Success} />
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
          <Button onClick={() => {}} fullWidth disabled style={{ marginBottom: "6.5rem" }}>
            Split
          </Button>
          <Button onClick={() => {}} fullWidth disabled>
            Export / Save Shares
          </Button>
        </>
      )}
    </div>
  )
}

export default GenerateContent
