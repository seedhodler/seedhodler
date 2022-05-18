import React, { useEffect, useState } from "react"

import { Button } from "components/Button"

import { langOptions, wordCountOptions } from "constants/index"
import { generateMnemonic, generateMnemonicFromEntropy, getEntropyDetails } from "helpers"

import { GenerateContentAdvanced } from "./GenerateContentAdvanced"
import { GenerateContentSettings } from "./GenerateContentSettings"
import classes from "./GenerateContent.module.scss"
import { GenerateContentShares } from "./GenerateContentShares"

const GenerateContent: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState(langOptions[0].value)
  const [selectedWordCount, setSelectedWordCount] = useState(wordCountOptions[0].value)
  const [mnemonic, setMnemonic] = useState(new Array(12).fill(""))
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [entropyValue, setEntropyValue] = useState("")
  const [shares, setShares] = useState<null | string[]>(null)
  const [activeShareItemId, setActiveShareItemId] = useState(0)
  const minBits = +selectedWordCount === 12 ? 128 : 256

  const { selectedEntropyAsBinary } = getEntropyDetails(entropyValue, minBits)
  const entropyToPass = selectedEntropyAsBinary.slice(
    selectedEntropyAsBinary.length - minBits,
    selectedEntropyAsBinary.length,
  )

  useEffect(() => {
    if (entropyToPass.length >= 128) {
      const mnemonic = generateMnemonicFromEntropy(selectedLang, entropyToPass)
      const mnemonicArr = mnemonic.split(" ")
      setMnemonic(mnemonicArr)
    }
  }, [selectedLang, entropyToPass])

  const handleGeneratePhase = () => {
    setShares(null)
    setActiveShareItemId(0)

    let mnemonic
    if (!isAdvanced) {
      mnemonic = generateMnemonic(selectedLang, +selectedWordCount)
    } else {
      mnemonic = generateMnemonicFromEntropy(selectedLang, entropyToPass)
    }
    const mnemonicArr = mnemonic.split(" ")
    setMnemonic(mnemonicArr)
  }

  useEffect(() => {
    setMnemonic(new Array(+selectedWordCount).fill(""))
  }, [selectedWordCount])

  return (
    <div className={classes.tabContent}>
      <GenerateContentSettings
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        selectedWordCount={selectedWordCount}
        setSelectedWordCount={setSelectedWordCount}
        isAdvanced={isAdvanced}
        setIsAdvanced={setIsAdvanced}
      />
      {isAdvanced ? (
        <GenerateContentAdvanced
          minBits={minBits}
          setEntropyValue={setEntropyValue}
          entropyValue={entropyValue}
        />
      ) : (
        <Button fullWidth style={{ marginBottom: "3.4rem" }} onClick={handleGeneratePhase}>
          Generate Phrase
        </Button>
      )}
      <GenerateContentShares
        mnemonic={mnemonic}
        shares={shares}
        selectedWordCount={selectedWordCount}
        activeShareItemId={activeShareItemId}
        setMnemonic={setMnemonic}
        setShares={setShares}
        setActiveShareItemId={setActiveShareItemId}
      />
    </div>
  )
}

export default GenerateContent
