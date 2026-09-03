import React, { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"

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
  // How many shares are needed to recover (the threshold), once it can be told
  // from the entered shares. Null while unknown. Never the total number created:
  // the share formats do not encode that.
  threshold: number | null
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
  threshold: null,
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
  const [threshold, setThreshold] = useState<number | null>(null)
  const [enteredShares, setEnteredShares] = useState<string[][]>([])
  const [activeShareItemId, setActiveShareItemId] = useState(0)
  // Memoised so the recovery effect below runs only when the shares actually
  // change, not on every render (a fresh array each render would loop the
  // effect's setState).
  const enteredSharesAsString = useMemo(
    () => enteredShares.map(shareItem => shareItem.join(" ")),
    [enteredShares],
  )
  const [restoredMnemonic, setRestoredMnemonic] = useState<string[]>(
    new Array(+selectedWordCount).fill(""),
  )
  const isFullMnemonic = restoredMnemonic.every(word => word.length > 0)

  // Reset the restore workspace whenever the share word count changes (which also
  // changes the scheme and seed size): the in-progress share, the collected set,
  // and the recovered seed no longer fit.
  useEffect(() => {
    setThreshold(null)
    setActiveShareItemId(0)
    setCurrentShare(new Array(shareLength).fill(""))
    setEnteredShares([])
    setRestoredMnemonic(new Array(+selectedWordCount).fill(""))
  }, [shareWordCount])

  // Recover the seed from the shares entered so far, and track the threshold.
  //
  // The threshold (how many shares are needed) is learned once and kept: SSKR
  // carries it in every share, SLIP-39 reveals it only through its own
  // below-threshold error. Recovery then runs over at most `threshold` shares,
  // because both libraries throw when handed more than they need; slicing keeps
  // a recovered seed recovered as further shares are added, instead of flipping
  // the count negative.
  useEffect(() => {
    if (enteredSharesAsString.length === 0) {
      setThreshold(null)
      setRestoredMnemonic(new Array(+selectedWordCount).fill(""))
      return
    }

    let t = selectedScheme === "sskr" ? sharesNeeded(enteredSharesAsString) ?? threshold : threshold
    const forRecovery = t ? enteredSharesAsString.slice(0, t) : enteredSharesAsString
    const result = recoverSeed(forRecovery)

    if ("mnemonic" in result) {
      setRestoredMnemonic(mnemonicToWords(result.mnemonic))
      if (!t) t = forRecovery.length
    } else {
      setRestoredMnemonic(new Array(+selectedWordCount).fill(""))
      if (!t) {
        const parsed = Number(result.error.split(" ")[5])
        if (Number.isFinite(parsed)) t = parsed
      }
    }
    setThreshold(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    threshold,
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
