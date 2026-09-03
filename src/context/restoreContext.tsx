import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from "react"

import { shareWordCountOptions } from "src/constants/"
import { recoverSeed, type Scheme, sharesNeeded, validateShare } from "src/core"
import { mnemonicToWords } from "src/helpers"

type Context = {
  // The one control on restore: how many words a single share has. Scheme and
  // seed size are derived from it, so they are read-only for consumers.
  shareWordCount: string
  setShareWordCount: Dispatch<SetStateAction<string>> | (() => void)
  selectedWordCount: string
  selectedScheme: Scheme
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
  shareWordCount: "20",
  setShareWordCount: () => {},
  selectedWordCount: "12",
  selectedScheme: "slip39",
  shareLength: 20,
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
  // The share word count is the single control; scheme and seed size follow from
  // it. SLIP-39: 20 words -> 12-word seed, 33 -> 24. SSKR bytewords: 25 -> 12, 41 -> 24.
  const [shareWordCount, setShareWordCount] = useState(shareWordCountOptions[0].value)
  const selectedScheme: Scheme = shareWordCount === "25" || shareWordCount === "41" ? "sskr" : "slip39"
  const selectedWordCount = shareWordCount === "20" || shareWordCount === "25" ? "12" : "24"
  const shareLength = +shareWordCount
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

  // Reset the restore workspace whenever the share word count changes (which also
  // changes the scheme and seed size): the in-progress share, the collected set,
  // and the recovered seed no longer fit.
  useEffect(() => {
    setInfoMessage("")
    setActiveShareItemId(0)
    setCurrentShare(new Array(shareLength).fill(""))
    setEnteredShares([])
    setRestoredMnemonic(new Array(+selectedWordCount).fill(""))
  }, [shareWordCount])

  // Recover the seed from the shares entered so far. Below the threshold the
  // core reports how many more are needed (per scheme) for the progress line;
  // when that count can't be told yet, fall back to a plain count so the line
  // never shows a bogus number.
  useEffect(() => {
    if (enteredSharesAsString.length > 0) {
      const restoreResult = recoverSeed(enteredSharesAsString)
      if ("mnemonic" in restoreResult) {
        setRestoredMnemonic(mnemonicToWords(restoreResult.mnemonic))
        setInfoMessage(`${enteredShares.length} of ${enteredShares.length} shares added`)
      } else {
        const neededSplitNumber = sharesNeeded(enteredSharesAsString)
        setInfoMessage(
          neededSplitNumber
            ? `${enteredShares.length} of ${neededSplitNumber} shares added - ${
                neededSplitNumber - enteredShares.length
              } shares remaining`
            : `${enteredShares.length} shares added`,
        )
      }
    }
  }, [enteredShares, enteredSharesAsString])

  const contextValue = {
    shareWordCount,
    setShareWordCount,
    selectedWordCount,
    selectedScheme,
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
