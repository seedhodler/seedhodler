import React, { useEffect, useState } from "react"

import LogoIcon from "assets/icons/Logo.svg"
import CoinIcon from "assets/icons/Coin.svg"
import CardsIcon from "assets/icons/Cards.svg"
import DiceIcon from "assets/icons/Dice.svg"
import NumbersIcon from "assets/icons/Numbers.svg"
import InfoGrayIcon from "assets/icons/InfoGray.svg"
import PrintIcon from "assets/icons/Print.svg"
import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { Button } from "components/Button"
import { Calc } from "components/Calc"
import { InfoTitle } from "components/InfoTitle"
import { Input } from "components/Input"
import { Select } from "components/Select"
import { Switch } from "components/Switch"
import { Textarea } from "components/Textarea"
import { Modal } from "components/Modal"
import { AdditionalInfo } from "components/AdditionalInfo"
import { TextPlace } from "components/TextPlace"
import { BadgeColorsEnum, ButtonColorsEnum, langOptions, wordCountOptions } from "constants/index"
import {
  generateMnemonic,
  generateMnemonicFromEntropy,
  getEntropyDetails,
  getFormattedShares,
  hexStringToByteArray,
  mnemonicToEntropy,
} from "helpers"

import { Shares } from "../Shares"
import { BadgeTitle } from "../../../../components/BadgeTitle"
import { EntropyValueType } from "../EntropyValueType"
import classes from "./GenerateContent.module.scss"

const GenerateContent: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState(langOptions[0].value)
  const [selectedWordCount, setSelectedWordCount] = useState(wordCountOptions[0].value)
  const [mnemonic, setMnemonic] = useState(new Array(12).fill(""))
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [isDetails, setIsDetails] = useState(false)
  const [entropyTypeId, setEntropyTypeId] = useState(0)
  const [entropyValue, setEntropyValue] = useState("")
  const [thresholdNumber, setThresholdNumber] = useState(3)
  const [sharesNumber, setSharesNumber] = useState(6)
  const [shares, setShares] = useState<null | string[]>(null)
  const [activeShareItemId, setActiveShareItemId] = useState(0)
  const [isPrintModalActive, setIsPrintModalActive] = useState(true)

  let inputCount = 0
  const minBits = +selectedWordCount === 12 ? 128 : 256
  const { selectedEntropyAsBinary, selectedEntropyDetails, regex } = getEntropyDetails(
    entropyValue,
    entropyTypeId,
    minBits,
  )

  const handleGenerateShares = () => {
    setActiveShareItemId(0)

    const mnemonicStr = mnemonic.join(" ")
    const groups = [[thresholdNumber, sharesNumber]]
    const masterSecret = hexStringToByteArray(mnemonicToEntropy(mnemonicStr))

    const shares = getFormattedShares(masterSecret, "", 1, groups)
    setShares(shares)
  }

  const handleGeneratePhase = () => {
    setShares(null)
    setActiveShareItemId(0)

    let mnemonic
    if (!isAdvanced) {
      mnemonic = generateMnemonic(selectedLang, +selectedWordCount)
    } else {
      const entropyToPass = selectedEntropyAsBinary.slice(
        selectedEntropyAsBinary.length - minBits,
        selectedEntropyAsBinary.length,
      )
      mnemonic = generateMnemonicFromEntropy(selectedLang, entropyToPass)
    }
    const mnemonicArr = mnemonic.split(" ")
    setMnemonic(mnemonicArr)
  }

  const handleEntropyChange = (id: number) => {
    setEntropyValue("")
    setEntropyTypeId(id)
  }

  useEffect(() => {
    setMnemonic(new Array(+selectedWordCount).fill(""))
  }, [selectedWordCount])

  return (
    <div className={classes.tabContent}>
      <BadgeTitle title="Phrase" additionalInfo="BIP 39" color={BadgeColorsEnum.Success} />
      <div className={classes.configContainer}>
        <div>
          <InfoTitle title="Language" desc="Language __placeholder" />
          <Select defaultValue={selectedLang} onChange={setSelectedLang} options={langOptions} />
        </div>
        <div>
          <InfoTitle title="Word Count" desc="Word Count __placeholder" />
          <Select
            defaultValue={selectedWordCount}
            onChange={setSelectedWordCount}
            options={wordCountOptions}
          />
        </div>
      </div>
      <div className={classes.configContainer}>
        <div
          className={classes.configLabelContainer}
          title={`None of these advanced functions are necessary for successful generating and
    splitting your seed phrase. when used incorrectly these advanced functions may lead to
    generating of unsafe seed phrases that can be (and will be) guessed easily. Be careful!`}
        >
          <p>
            Advanced Toolset -{" "}
            <span className={classes.entropyGeneration}>
              {isAdvanced
                ? "Careful, extremely dangerous when used incorrectly 🔥"
                : "Entropy Generation"}
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
            <div className={classes.wrapperColumn}>
              <InfoTitle title="Entropy Value Type" desc="Entropy Value Type __placeholder" />
              <div className={classes.entropyOptionsContainer}>
                <EntropyValueType
                  title="Coin Flip"
                  subtitle="[1,2]"
                  isActive={entropyTypeId === 0}
                  onClick={() => handleEntropyChange(0)}
                  icon={CoinIcon}
                />
                <EntropyValueType
                  title="Card"
                  subtitle="[A2-9TJQK[CDHS]"
                  isActive={entropyTypeId === 1}
                  onClick={() => handleEntropyChange(1)}
                  icon={CardsIcon}
                />
                <EntropyValueType
                  title="Dice"
                  subtitle="[1-6]"
                  isActive={entropyTypeId === 2}
                  onClick={() => handleEntropyChange(2)}
                  icon={DiceIcon}
                />
                <EntropyValueType
                  title="Numbers"
                  subtitle="[0-9]"
                  isActive={entropyTypeId === 3}
                  onClick={() => handleEntropyChange(3)}
                  icon={NumbersIcon}
                />
              </div>
            </div>
            <div className={classes.wrapperColumn}>
              <InfoTitle title="Mouse" desc="Mouse __placeholder" />
              <Button onClick={() => {}}>Start calculation</Button>
            </div>
          </div>
          <div className={classes.infoAndValidation}>
            <InfoTitle
              title="Manual - Enter your own entropy"
              desc="Manual - Enter your own entropy __placeholder"
            />
            <div className={classes.validation}>Valid Entropy</div>
          </div>
          <Textarea
            value={entropyValue}
            onChange={setEntropyValue}
            regex={regex}
            style={{ marginBottom: "3.4rem" }}
          />
        </>
      )}
      {isDetails && (
        <>
          <BadgeTitle title="Entropy details" color={BadgeColorsEnum.ErrorLight} />
          <p className={classes.insightsLabel}>Here are more insights into your manual input</p>
          <div className={classes.insightsContainer}>
            <div className={classes.insightBlock}>
              <p className={classes.insightTitle}>Time to Crack</p>
              <div className={classes.insightContentContainer}>
                <span className={classes.insightBadge}>Centuries</span>
                <p className={classes.insightContent}>{selectedEntropyDetails.timeToCrack}</p>
              </div>
            </div>
            <div className={classes.insightBlock}>
              <p className={classes.insightTitle}>Total Bits</p>
              <p className={classes.insightContent}>{selectedEntropyDetails.totalBits}</p>
            </div>
            <div className={classes.insightBlock}>
              <p className={classes.insightTitle}>Entropy Type</p>
              <p className={classes.insightContent}>{selectedEntropyDetails.entropyType}</p>
            </div>
            <div className={classes.insightBlock}>
              <p className={classes.insightTitle}>Raw Entropy Words</p>
              <p className={classes.insightContent}>{selectedEntropyDetails.rawEntropyWords}</p>
            </div>
          </div>
        </>
      )}
      <Button
        fullWidth
        style={{ marginBottom: "3.4rem" }}
        onClick={handleGeneratePhase}
        disabled={isAdvanced && selectedEntropyAsBinary.length < minBits}
      >
        Generate Phrase
      </Button>
      <InfoTitle title="BIP39 Seed Phrase" desc="BIP39 Seed Phrase __placeholder" />
      <div
        className={classes.seedPhraseContainer}
        style={{ height: selectedWordCount === "12" ? "360px" : "720px" }}
      >
        {mnemonic.map((word, index) => (
          <Input
            key={index}
            count={++inputCount}
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
          <BadgeTitle title="Split Phrase into shares" color={BadgeColorsEnum.Success} />
          <p className={classes.sharesInfo}>
            The generated Phrase can now be split into up to 6 different shares. These can then be
            combined to restore your Phrase
          </p>
          <div className={classes.thresholdSharesContainer}>
            <div className={classes.calcContainer}>
              <InfoTitle
                title="Threshold"
                desc="Threshold __placeholder"
                className={classes.calcTitle}
              />
              <Calc
                value={thresholdNumber}
                plusDisabled={thresholdNumber >= sharesNumber}
                minusDisabled={thresholdNumber <= 1}
                onPlus={() => setThresholdNumber(prev => ++prev)}
                onMinus={() => setThresholdNumber(prev => (prev <= 1 ? prev : --prev))}
              />
            </div>
            <div className={classes.calcContainer}>
              <InfoTitle title="Shares" desc="Shares __placeholder" className={classes.calcTitle} />
              <Calc
                value={sharesNumber}
                plusDisabled={sharesNumber >= 16}
                minusDisabled={sharesNumber <= 1 || sharesNumber <= thresholdNumber}
                onPlus={() => setSharesNumber(prev => (prev >= 16 ? prev : ++prev))}
                onMinus={() => setSharesNumber(prev => (prev <= 1 ? prev : --prev))}
              />
            </div>
          </div>
          <Button onClick={handleGenerateShares} fullWidth style={{ marginBottom: "3.6rem" }}>
            Split
          </Button>
          {shares && (
            <Shares
              shares={shares}
              activeShareItemId={activeShareItemId}
              setActiveShareItemId={setActiveShareItemId}
              selectedWordCount={+selectedWordCount}
            />
          )}
          <Button
            onClick={() => setIsPrintModalActive(true)}
            disabled={!Boolean(shares)}
            fullWidth
            color={ButtonColorsEnum.Success}
          >
            Export / Save Shares
          </Button>
        </>
      )}
      <Modal
        title="Print - Seedhodler Phraseholder"
        isActive={isPrintModalActive}
        setIsActive={setIsPrintModalActive}
      >
        <>
          <p className={classes.modalDescription}>
            Before continuing please either print the provided Seedhodler Phraseholder or use pen and
            paper to write down your generated phrases.
          </p>
          <div className={classes.modalContentContainer}>
            <div className={classes.modalHeaderContainer}>
              <div style={{ width: "60px" }}></div>
              <img src={LogoIcon} alt="Logo" />
              <AdditionalInfo info="BIP 39" />
            </div>
            <p className={classes.modalInnerDescription}>
              Use the Seedhodler Phraseholder to write down your generated phrases.
            </p>
            <div
              className={classes.seedPhraseContainer}
              style={{ height: selectedWordCount === "12" ? "360px" : "720px" }}
            >
              {mnemonic.map((word, index) => (
                <TextPlace
                  text=""
                  count={index + 1}
                  style={{
                    width: "48%",
                    alignSelf:
                      index <= (selectedWordCount === "12" ? 5 : 11) ? "flex-start" : "flex-end",
                  }}
                />
              ))}
            </div>
            <p className={classes.modalInnerDescription} style={{ marginBottom: 0 }}>
              etc.
              <br /> In seedhodler we trust.
            </p>
          </div>
          <div className={classes.modalButtonsContainer}>
            <Button onClick={() => {}} iconRight={PrintIcon} color={ButtonColorsEnum.ErrorLightish}>
              Print
            </Button>
            <Button onClick={() => {}} iconRight={ArrowRightIcon}>
              Continue
            </Button>
          </div>
        </>
      </Modal>
    </div>
  )
}

export default GenerateContent
