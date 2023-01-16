import React, { useContext } from "react"

import { Button } from "components/Button"
import { GenerateContext } from "context/generateContext"

import { GenerateContentAdvanced } from "./GenerateContentAdvanced"
import { GenerateContentSettings } from "./GenerateContentSettings"
import classes from "./GenerateContent.module.scss"
import { GenerateContentShares } from "./GenerateContentShares"

const GenerateContent: React.FC = () => {
  const {
    selectedLang,
    setSelectedLang,
    selectedWordCount,
    setSelectedWordCount,
    mnemonic12,
    setMnemonic12,
    mnemonic24,
    setMnemonic24,
    isAdvanced,
    setIsAdvanced,
    entropyValue,
    setEntropyValue,
    shares12,
    shares24,
    activeShareItemId,
    setActiveShareItemId,
    entropyTypeId,
    setEntropyTypeId,
    minBits,
    thresholdNumber,
    setThresholdNumber,
    sharesNumber,
    setSharesNumber,
    handleGenerateShares,
    handleGeneratePhase,
    isValidMnemonic,
  } = useContext(GenerateContext)

  const is12words = selectedWordCount === "12"
  const mnemonic = is12words ? mnemonic12 : mnemonic24
  const setMnemonic = is12words ? setMnemonic12 : setMnemonic24
  const shares = is12words ? shares12 : shares24

  return (
    <div className={classes.tabContent}>
      <GenerateContentSettings
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        selectedWordCount={selectedWordCount}
        setSelectedWordCount={setSelectedWordCount}
        isAdvanced={isAdvanced}
        setIsAdvanced={setIsAdvanced}
        setEntropyValue={setEntropyValue}
      />
      {isAdvanced ? (
        <GenerateContentAdvanced
          minBits={minBits}
          setEntropyValue={setEntropyValue}
          entropyValue={entropyValue}
          entropyTypeId={entropyTypeId}
          setEntropyTypeId={setEntropyTypeId}
        />
      ) : (
        <Button fullWidth style={{ marginBottom: "3.4rem" }} onClick={handleGeneratePhase}>
          Generate Master Seed
        </Button>
      )}
      <GenerateContentShares
        mnemonic={mnemonic}
        shares={shares}
        selectedWordCount={selectedWordCount}
        activeShareItemId={activeShareItemId}
        setMnemonic={setMnemonic}
        setActiveShareItemId={setActiveShareItemId}
        thresholdNumber={thresholdNumber}
        setThresholdNumber={setThresholdNumber}
        sharesNumber={sharesNumber}
        setSharesNumber={setSharesNumber}
        handleGenerateShares={handleGenerateShares}
        isValidMnemonic={isValidMnemonic}
      />
    </div>
  )
}

export default GenerateContent
