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
import { generateMnemonic, generateMnemonicFromEntropy, parseBigInt } from "helpers"
import { ColorOptions, langOptions, wordCountOptions, cardDictionary } from "constants/index"

import { BadgeTitle } from "../BadgeTitle"
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
  const [thresholdValue, setThresholdValue] = useState(3)
  const [sharesValue, setSharesValue] = useState(6)

  let count = 0
  const minBits = +selectedWordCount === 12 ? 128 : 256

  const regexVariants = {
    0: /[^0-1]/,
    2: /[^1-6]/,
    3: /[^0-9]/,
  }

  const getBinaryFromCardEntropy = (entropyValue: string) => {
    let resultBinary = ""

    const cardsArr = entropyValue.match(/.{1,2}/g)
    cardsArr?.forEach(card => {
      const cardAsBinary = cardDictionary[card.toLowerCase() as keyof typeof cardDictionary]
      if (card.length === 2 && cardAsBinary) {
        resultBinary += cardAsBinary
      }
    })

    return resultBinary
  }

  const entropiesAsBinary = {
    0: entropyValue,
    // TODO: remove once logic will be ready
    1: getBinaryFromCardEntropy(entropyValue),
    // TODO: temp condition to remove error when entering value for Number entropy
    // replace(/6/g, "0") - workaround to use 1-6 in dice, instead of 0-5
    2: entropyTypeId === 2 ? parseBigInt(entropyValue.replace(/6/g, "0") || "0", 6).toString(2) : "0",
    3: entropyTypeId === 2 ? BigInt(entropyValue).toString(2) : "0",
  }
  const selectedEntropyAsBinary = entropiesAsBinary[entropyTypeId as keyof typeof entropiesAsBinary]

  const entropyDetails = {
    0: {
      timeToCrack: "temp",
      totalBits: `${entropyValue.length} / ${minBits}`,
      entropyType: "Binary [0-1], 101010011",
      rawEntropyWords: "?",
      // entropyAsBinary: entropyValue,
    },
    1: {
      timeToCrack: "temp",
      totalBits: `${selectedEntropyAsBinary.length} / ${minBits}`,
      entropyType: "Card [A2-9TJQK][CDHS], ahqs9dtc",
      rawEntropyWords: "?",
      // entropyAsBinary: getBinaryFromCardEntropy(entropyValue),
    },
    2: {
      timeToCrack: "temp",
      totalBits: `${selectedEntropyAsBinary.length} / ${minBits}`,
      entropyType: "Dice [1-6], 25356341",
      rawEntropyWords: "?",
      // entropyAsBinary:
      //   entropyTypeId === 2 ? parseBigInt(entropyValue.replace(/6/g, "0") || "0", 6).toString(2) : "0",
    },
    3: {
      timeToCrack: "temp",
      totalBits: `${selectedEntropyAsBinary.length} / ${minBits}`,
      entropyType: "Numbers [0-9], 90834528",
      rawEntropyWords: "?",
      // entropyAsBinary: entropyTypeId === 2 ? BigInt(entropyValue).toString(2) : "0",
    },
  }
  const selectedEntropyDetails = entropyDetails[entropyTypeId as keyof typeof entropyDetails]

  const handleGeneratePhase = () => {
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
      <BadgeTitle title="Phrase" additionalInfo="BIP 39" color={ColorOptions.Success} />
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
            regex={regexVariants[entropyTypeId as keyof typeof regexVariants]}
            style={{ marginBottom: "3.4rem" }}
          />
        </>
      )}
      {isDetails && (
        <>
          <BadgeTitle title="Entropy details" color={ColorOptions.ErrorLight} />
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
                value={thresholdValue}
                plusDisabled={thresholdValue >= sharesValue}
                minusDisabled={sharesValue <= 1}
                onPlus={() => setThresholdValue(prev => ++prev)}
                onMinus={() => setThresholdValue(prev => (prev <= 0 ? prev : --prev))}
              />
            </div>
            <div className={classes.calcContainer}>
              <InfoTitle title="Shares" desc="Shares __placeholder" className={classes.calcTitle} />
              <Calc
                value={sharesValue}
                minusDisabled={sharesValue <= 1 || sharesValue <= thresholdValue}
                onPlus={() => setSharesValue(prev => ++prev)}
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
