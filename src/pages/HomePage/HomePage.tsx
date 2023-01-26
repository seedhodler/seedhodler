import React, { useState, useContext, useEffect } from "react"

import GenerateIcon from "assets/icons/GenerateWithBg.svg"
import RestoreIcon from "assets/icons/RestoreWithBg.svg"
import { RestoreContext } from "context/restoreContext"
import { GenerateContext } from "context/generateContext"
import { generateMnemonicFromEntropy, restoreMnemonic, validateMnemonic } from "helpers"

import { GenerateContent } from "./components/GenerateContent"
import { RestoreContent } from "./components/RestoreContent"
import { Tab } from "./components/Tab"
import classes from "./HomePage.module.scss"

const HomePage: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(0)
  const {
    selectedWordCount: selectedWordCountGenerate,
    entropyToPass,
    selectedLang,
    minBits,
    thresholdNumber,
    sharesNumber,
    mnemonic12,
    setMnemonic12,
    mnemonic24,
    setMnemonic24,
    shares12,
    shares24,
    handleGenerateShares,
    isValidMnemonic,
    setIsValidMnemonic,
  } = useContext(GenerateContext)
  const {
    shareLength,
    selectedWordCount: selectedWordCountRestore,
    enteredSharesAsString,
    enteredShares,
    setInfoMessage,
    setActiveShareItemId,
    setCurrentShare,
    setEnteredShares,
    setRestoredMnemonic,
  } = useContext(RestoreContext)

  const is12wordsGenerate = selectedWordCountGenerate === "12"
  const shares = is12wordsGenerate ? shares12 : shares24
  const mnemonic = is12wordsGenerate ? mnemonic12 : mnemonic24

  // Generate effects
  useEffect(() => {
    if (entropyToPass.length >= minBits) {
      const mnemonic = generateMnemonicFromEntropy(selectedLang, entropyToPass)
      const mnemonicArr = mnemonic.split(" ")
      if (is12wordsGenerate) {
        setMnemonic12(mnemonicArr)
      } else {
        setMnemonic24(mnemonicArr)
      }
    }
  }, [selectedLang, entropyToPass])

  useEffect(() => {
    if (shares && validateMnemonic(mnemonic.join(" "))) {
      handleGenerateShares()
    }
  }, [thresholdNumber, sharesNumber, mnemonic12, mnemonic24])

  useEffect(() => {
    const isFullMnemonic = !mnemonic.some(word => word.length === 0)

    if (!isFullMnemonic) {
      setIsValidMnemonic(true)
    }

    if (isFullMnemonic && mnemonic[mnemonic.length - 1].length >= 3) {
      setIsValidMnemonic(validateMnemonic(mnemonic.join(" ")))
    }
  }, [mnemonic])

  // Restore effects
  useEffect(() => {
    setInfoMessage("")
    setActiveShareItemId(0)
    setCurrentShare(new Array(shareLength).fill(""))
    setEnteredShares([])
    setRestoredMnemonic(new Array(+selectedWordCountRestore).fill(""))
  }, [shareLength, selectedWordCountRestore])

  useEffect(() => {
    if (enteredSharesAsString.length > 0) {
      const restoreResult = restoreMnemonic(enteredSharesAsString)
      if (restoreResult.error) {
        //@ts-ignore
        const neededSplitNumber = restoreResult.error.split(" ")[5]
        setInfoMessage(
          `${enteredShares.length} of ${neededSplitNumber} splits added - ${
            neededSplitNumber - enteredShares.length
          } splits remaining`,
        )
      } else {
        //@ts-ignore
        setRestoredMnemonic(restoreResult.mnemonic.split(" "))
        setInfoMessage(`${enteredShares.length} of ${enteredShares.length} splits added`)
      }
    }
  }, [enteredShares, enteredSharesAsString])

  return (
    <>
      <div className={classes.tabsContainer}>
        <Tab
          title="Generate"
          desc="Generate a BIP39 Master Seed and split it into shares"
          icon={GenerateIcon}
          active={activeTabId === 0}
          onClick={() => setActiveTabId(0)}
        />
        <Tab
          title="Restore"
          desc="Combine enough shares to retrieve your Master Seed"
          icon={RestoreIcon}
          active={activeTabId === 1}
          onClick={() => setActiveTabId(1)}
        />
      </div>
      <div className={classes.tabContent}>
        {activeTabId === 0 ? <GenerateContent /> : <RestoreContent />}
      </div>
    </>
  )
}

export default HomePage
