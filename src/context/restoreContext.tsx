import React, { Dispatch, SetStateAction, useState, createContext } from "react"

import { wordCountOptions } from "constants/"
import { validateShare } from "helpers"

type Context = {
  selectedWordCount: string
  setSelectedWordCount: Dispatch<SetStateAction<string>> | (() => void)
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
  shareLength: 1,
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
  const shareLength = selectedWordCount === "12" ? 20 : 33
  const [currentShare, setCurrentShare] = useState<string[]>(new Array(shareLength).fill(""))
  const isCurrentShareValid = validateShare(currentShare.join(" "))
  const [infoMessage, setInfoMessage] = useState("")
  const [enteredShares, setEnteredShares] = useState<string[][]>([])
  const [activeShareItemId, setActiveShareItemId] = useState(0)
  const enteredSharesAsString = enteredShares.map(shareItem => shareItem.join(" "))
  const [restoredMnemonic, setRestoredMnemonic] = useState<string[]>(
    new Array(+selectedWordCount).fill(""),
  )
  const isFullMnemonic = restoredMnemonic.every(word => word.length > 0)

  const contextValue = {
    selectedWordCount,
    setSelectedWordCount,
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
