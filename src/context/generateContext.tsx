import React, { Dispatch, SetStateAction, useState, createContext } from "react"

import { wordCountOptions, langOptions } from "constants/"
import {
  generateMnemonic,
  generateMnemonicFromEntropy,
  getEntropyDetails,
  getFormattedShares,
  hexStringToByteArray,
  mnemonicToEntropy,
} from "helpers"

type Context = {
  selectedLang: string
  setSelectedLang: Dispatch<SetStateAction<string>> | (() => void)
  selectedWordCount: string
  setSelectedWordCount: Dispatch<SetStateAction<string>> | (() => void)
  mnemonic: string[]
  setMnemonic: Dispatch<SetStateAction<string[]>> | (() => void)
  isAdvanced: boolean
  setIsAdvanced: Dispatch<SetStateAction<boolean>> | (() => void)
  entropyValue: string
  setEntropyValue: Dispatch<SetStateAction<string>> | (() => void)
  shares: null | string[]
  setShares: Dispatch<SetStateAction<null | string[]>> | (() => void)
  activeShareItemId: number
  setActiveShareItemId: Dispatch<SetStateAction<number>> | (() => void)
  entropyTypeId: number
  setEntropyTypeId: Dispatch<SetStateAction<number>> | (() => void)
  minBits: 128 | 256
  entropyToPass: string
  thresholdNumber: number
  setThresholdNumber: Dispatch<SetStateAction<number>> | (() => void)
  sharesNumber: number
  setSharesNumber: Dispatch<SetStateAction<number>> | (() => void)
  handleGenerateShares: () => void
  handleGeneratePhase: () => void
}

export const GenerateContext = createContext<Context>({
  selectedLang: "english",
  setSelectedLang: () => {},
  selectedWordCount: "12",
  setSelectedWordCount: () => {},
  mnemonic: [""],
  setMnemonic: () => {},
  isAdvanced: false,
  setIsAdvanced: () => {},
  entropyValue: "",
  setEntropyValue: () => {},
  shares: null,
  setShares: () => {},
  activeShareItemId: 0,
  setActiveShareItemId: () => {},
  entropyTypeId: 0,
  setEntropyTypeId: () => {},
  minBits: 128,
  entropyToPass: "",
  thresholdNumber: 0,
  setThresholdNumber: () => {},
  sharesNumber: 0,
  setSharesNumber: () => {},
  handleGenerateShares: () => {},
  handleGeneratePhase: () => {},
})

type ProviderProps = {
  children: JSX.Element
}

export const GenerateContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState(langOptions[0].value)
  const [selectedWordCount, setSelectedWordCount] = useState(wordCountOptions[0].value)
  const [mnemonic, setMnemonic] = useState(new Array(12).fill(""))
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [entropyValue, setEntropyValue] = useState("")
  const [shares, setShares] = useState<null | string[]>(null)
  const [activeShareItemId, setActiveShareItemId] = useState(0)
  const [entropyTypeId, setEntropyTypeId] = useState(0)
  const minBits: 128 | 256 = +selectedWordCount === 12 ? 128 : 256
  const [thresholdNumber, setThresholdNumber] = useState(3)
  const [sharesNumber, setSharesNumber] = useState(5)

  const { selectedEntropyAsBinary } = getEntropyDetails(entropyValue, minBits, entropyTypeId)
  const entropyToPass = selectedEntropyAsBinary.slice(0, minBits)

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

  const handleGenerateShares = () => {
    setActiveShareItemId(0)

    const mnemonicStr = mnemonic.join(" ")
    const groups = [[thresholdNumber, sharesNumber]]
    const masterSecret = hexStringToByteArray(mnemonicToEntropy(mnemonicStr))

    const shares = getFormattedShares(masterSecret, "", 1, groups)
    setShares(shares)
  }

  const contextValue = {
    selectedLang,
    setSelectedLang,
    selectedWordCount,
    setSelectedWordCount,
    mnemonic,
    setMnemonic,
    isAdvanced,
    setIsAdvanced,
    entropyValue,
    setEntropyValue,
    shares,
    setShares,
    activeShareItemId,
    setActiveShareItemId,
    entropyTypeId,
    setEntropyTypeId,
    minBits,
    entropyToPass,
    thresholdNumber,
    setThresholdNumber,
    sharesNumber,
    setSharesNumber,
    handleGenerateShares,
    handleGeneratePhase,
  }

  return <GenerateContext.Provider value={contextValue}>{children}</GenerateContext.Provider>
}
