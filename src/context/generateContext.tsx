import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from "react"

import { langOptions, wordCountOptions } from "src/constants/"
import { generateSeed, type Scheme, seedFromEntropy, splitSeed, validateSeed } from "src/core"
import { getEntropyDetails, mnemonicToWords } from "src/helpers"

type Context = {
  selectedLang: string
  setSelectedLang: Dispatch<SetStateAction<string>> | (() => void)
  selectedWordCount: string
  setSelectedWordCount: Dispatch<SetStateAction<string>> | (() => void)
  selectedScheme: Scheme
  setSelectedScheme: Dispatch<SetStateAction<Scheme>> | (() => void)
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
  isValidMnemonic: boolean
  setIsValidMnemonic: Dispatch<SetStateAction<boolean>> | (() => void)
}

export const GenerateContext = createContext<Context>({
  selectedLang: "english",
  setSelectedLang: () => { },
  selectedWordCount: "12",
  setSelectedWordCount: () => { },
  selectedScheme: "sskr",
  setSelectedScheme: () => { },
  mnemonic: [""],
  setMnemonic: () => { },
  isAdvanced: false,
  setIsAdvanced: () => { },
  entropyValue: "",
  setEntropyValue: () => { },
  shares: null,
  setShares: () => { },
  activeShareItemId: 0,
  setActiveShareItemId: () => { },
  entropyTypeId: 0,
  setEntropyTypeId: () => { },
  minBits: 128,
  entropyToPass: "",
  thresholdNumber: 0,
  setThresholdNumber: () => { },
  sharesNumber: 0,
  setSharesNumber: () => { },
  handleGenerateShares: () => { },
  handleGeneratePhase: () => { },
  isValidMnemonic: true,
  setIsValidMnemonic: () => { },
})

type ProviderProps = {
  children: JSX.Element
}

export const GenerateContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState(langOptions[0].value)
  const [selectedWordCount, setSelectedWordCount] = useState(wordCountOptions[0].value)
  const [selectedScheme, setSelectedScheme] = useState<Scheme>("sskr")
  // One mnemonic and one share set. The word count lives in selectedWordCount,
  // not in two parallel 12/24 pairs; the array is resized to match it (see the
  // reset effect below).
  const [mnemonic, setMnemonic] = useState<string[]>(new Array(+wordCountOptions[0].value).fill(""))
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [entropyValue, setEntropyValue] = useState("")
  const [shares, setShares] = useState<null | string[]>(null)
  const [activeShareItemId, setActiveShareItemId] = useState(0)
  const [entropyTypeId, setEntropyTypeId] = useState(0)
  const minBits: 128 | 256 = +selectedWordCount === 12 ? 128 : 256
  const [thresholdNumber, setThresholdNumber] = useState(3)
  const [sharesNumber, setSharesNumber] = useState(5)
  const [isValidMnemonic, setIsValidMnemonic] = useState(true)

  const { selectedEntropyAsBinary } = getEntropyDetails(entropyValue, minBits, entropyTypeId)
  const entropyToPass = selectedEntropyAsBinary.slice(-minBits)

  const handleGeneratePhase = () => {
    setShares(null)
    setActiveShareItemId(0)

    const generated = isAdvanced
      ? seedFromEntropy(selectedLang, entropyToPass)
      : generateSeed(selectedLang, +selectedWordCount)

    setMnemonic(mnemonicToWords(generated))
  }

  const handleGenerateShares = () => {
    setActiveShareItemId(0)
    const newShares = splitSeed(mnemonic.join(" "), {
      scheme: selectedScheme,
      threshold: thresholdNumber,
      shares: sharesNumber,
    })
    setShares(newShares)
  }

  // Reset the mnemonic (and any shares derived from it) whenever the language or
  // the word count changes: the array must match the new word count, and stale
  // shares no longer belong to it. Declared before the advanced effect so that in
  // advanced mode the live regeneration below runs after this and wins.
  useEffect(() => {
    setMnemonic(new Array(+selectedWordCount).fill(""))
    setShares(null)
  }, [selectedLang, selectedWordCount])

  // In advanced mode the mnemonic reflects the entered entropy live. Once the
  // entropy is long enough a seed is derived; if the user then deletes back below
  // the threshold, clear the seed and any shares split from it so the display
  // does not keep showing a stale seed while the readout says "too short". Guard
  // on isAdvanced: in simple mode the seed comes from the Generate button, not
  // from entropy, and must not be wiped here.
  useEffect(() => {
    if (entropyToPass.length >= minBits) {
      setMnemonic(mnemonicToWords(seedFromEntropy(selectedLang, entropyToPass)))
    } else if (isAdvanced) {
      setMnemonic(new Array(+selectedWordCount).fill(""))
      setShares(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLang, entropyToPass])

  // When the scheme, threshold, share count, or the seed itself changes and a
  // share set already exists, re-split so the shares stay in sync. The scheme
  // must be here too: without it, switching SLIP-39/SSKR left the old shares on
  // screen while the selector and Print/Verify moved to the new scheme. The
  // change is gated behind the same confirmation as threshold/count in the UI.
  useEffect(() => {
    if (shares && validateSeed(mnemonic.join(" "))) {
      handleGenerateShares()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdNumber, sharesNumber, mnemonic, selectedScheme])

  // Track whether the fully entered seed is a valid BIP-39 mnemonic, for the
  // inline validation the UI shows while a seed is being typed.
  useEffect(() => {
    const isFullMnemonic = !mnemonic.some(word => word.length === 0)

    if (!isFullMnemonic) {
      setIsValidMnemonic(true)
    }

    if (isFullMnemonic && mnemonic[mnemonic.length - 1].length >= 3) {
      setIsValidMnemonic(validateSeed(mnemonic.join(" ")))
    }
  }, [mnemonic])

  const contextValue = {
    selectedLang,
    setSelectedLang,
    selectedWordCount,
    setSelectedWordCount,
    selectedScheme,
    setSelectedScheme,
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
    isValidMnemonic,
    setIsValidMnemonic,
  }

  return <GenerateContext.Provider value={contextValue}>{children}</GenerateContext.Provider>
}
