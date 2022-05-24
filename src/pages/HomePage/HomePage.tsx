import React, { useState, useContext, useEffect } from "react"

import GenerateIcon from "assets/icons/GenerateWithBg.svg"
import RestoreIcon from "assets/icons/RestoreWithBg.svg"
import { RestoreContext } from "context/restoreContext"
import { restoreMnemonic } from "helpers"

import { GenerateContent } from "./components/GenerateContent"
import { RestoreContent } from "./components/RestoreContent"
import { Tab } from "./components/Tab"
import classes from "./HomePage.module.scss"

const HomePage: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(0)
  const {
    shareLength,
    selectedWordCount,
    enteredSharesAsString,
    enteredShares,
    setInfoMessage,
    setActiveShareItemId,
    setCurrentShare,
    setEnteredShares,
    setRestoredMnemonic,
  } = useContext(RestoreContext)

  // Restore effects
  useEffect(() => {
    setInfoMessage("")
    setActiveShareItemId(0)
    setCurrentShare(new Array(shareLength).fill(""))
    setEnteredShares([])
    setRestoredMnemonic(new Array(+selectedWordCount).fill(""))
  }, [shareLength, selectedWordCount])

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
          desc="Generate __placeholder"
          icon={GenerateIcon}
          active={activeTabId === 0}
          onClick={() => setActiveTabId(0)}
        />
        <Tab
          title="Restore"
          desc="Restore __placeholder"
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
