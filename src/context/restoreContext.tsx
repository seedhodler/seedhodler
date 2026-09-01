import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from "react"

import { wordCountOptions } from "src/constants/"
import { recoverSeed, type Scheme, validateShare } from "src/core"
import { mnemonicToWords } from "src/helpers"

type Context = {
  selectedWordCount: string
  setSelectedWordCount: Dispatch<SetStateAction<string>> | (() => void)
  selectedScheme: Scheme
  setSelectedScheme: Dispatch<SetStateAction<Scheme>> | (() => void)
  shareLength: number
  currentShare: string[]
  setCurrentShare: Dispatch<SetStateAction<string[]>> | (() => void)
  isCurrentShareValid: boolean
  infoMessage: string
  setInfoMessage: Dispatch<SetStateAction<string>> | (() => void)
  enteredShares: string[][]
  setEnteredShares: Dispatch<SetStateAction<string[][]>> | (() => void)
  activeShareItemId: number
  setActiveShareItemId: Dispatch<SetStateAction<number>> | (() => void)
  enteredSharesAsString: string[]
  restoredMnemonic: string[]
  setRestoredMnemonic: Dispatch<SetStateAction<string[]>> | (() => void)
  isFullMnemonic: boolean
}

export const RestoreContext = createContext<Context>({
  selectedWordCount: "12",
  setSelectedWordCount: () => {},
  selectedScheme: "sskr",
  setSelectedScheme: () => {},
  shareLength: 25,
  currentShare: [""],
  setCurrentShare: () => {},
  isCurrentShareValid: false,
  infoMessage: "",
  setInfoMessage: () => {},
  enteredShares: [[""]],
  setEnteredShares: () => {},
  activeShareItemId: 0,
  setActiveShareItemId: () => {},
  enteredSharesAsString: [""],
  restoredMnemonic: [""],
  setRestoredMnemonic: () => {},
  isFullMnemonic: false,
})

type ProviderProps = {
  children: JSX.Element
}

export const RestoreContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [selectedWordCount, setSelectedWordCount] = useState(wordCountOptions[0].value)
  const [selectedScheme, setSelectedScheme] = useState<Scheme>("sskr")
  // SLIP-39: 20 words for a 12-word seed, 33 for 24. SSKR bytewords: 25 and 41.
  const is12 = selectedWordCount === "12"
  const shareLength = selectedScheme === "sskr" ? (is12 ? 25 : 41) : is12 ? 20 : 33
  const [currentShare, setCurrentShare] = useState<string[]>(new Array(shareLength).fill(""))
  const isCurrentShareValid = validateShare(currentShare.join(" "), selectedScheme)
  const [infoMessage, setInfoMessage] = useState("")
  const [enteredShares, setEnteredShares] = useState<string[][]>([])
  const [activeShareItemId, setActiveShareItemId] = useState(0)
  const enteredSharesAsString = enteredShares.map(shareItem => shareItem.join(" "))
  const [restoredMnemonic, setRestoredMnemonic] = useState<string[]>(
    new Array(+selectedWordCount).fill(""),
  )
  const isFullMnemonic = restoredMnemonic.every(word => word.length > 0)

  // Reset the restore workspace whenever the expected share length or word count
  // changes: the in-progress share, the collected set, and the recovered seed no
  // longer fit.
  useEffect(() => {
    setInfoMessage("")
    setActiveShareItemId(0)
    setCurrentShare(new Array(shareLength).fill(""))
    setEnteredShares([])
    setRestoredMnemonic(new Array(+selectedWordCount).fill(""))
  }, [shareLength, selectedWordCount])

  // Recover the seed from the shares entered so far. Below the threshold the
  // SLIP-39 library reports how many more are needed; that count is parsed out
  // of its error message for the progress line.
  useEffect(() => {
    if (enteredSharesAsString.length > 0) {
      const restoreResult = recoverSeed(enteredSharesAsString)
      if ("mnemonic" in restoreResult) {
        setRestoredMnemonic(mnemonicToWords(restoreResult.mnemonic))
        setInfoMessage(`${enteredShares.length} of ${enteredShares.length} splits added`)
      } else {
        const neededSplitNumber = Number(restoreResult.error.split(" ")[5])
        setInfoMessage(
          `${enteredShares.length} of ${neededSplitNumber} splits added - ${
            neededSplitNumber - enteredShares.length
          } splits remaining`,
        )
      }
    }
  }, [enteredShares, enteredSharesAsString])

  const contextValue = {
    selectedWordCount,
    setSelectedWordCount,
    selectedScheme,
    setSelectedScheme,
    shareLength,
    currentShare,
    setCurrentShare,
    isCurrentShareValid,
    infoMessage,
    setInfoMessage,
    enteredShares,
    setEnteredShares,
    activeShareItemId,
    setActiveShareItemId,
    enteredSharesAsString,
    restoredMnemonic,
    setRestoredMnemonic,
    isFullMnemonic,
  }

  return <RestoreContext.Provider value={contextValue}>{children}</RestoreContext.Provider>
}
