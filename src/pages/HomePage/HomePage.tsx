import React, { lazy, Suspense, useState } from "react"

import GenerateIcon from "src/assets/icons/GenerateWithBg.svg"
import RestoreIcon from "src/assets/icons/RestoreWithBg.svg"

import { Tab } from "./components/Tab"
import classes from "./HomePage.module.scss"
const GenerateContent = lazy(() => import("./components/GenerateContent"))
const RestoreContent = lazy(() => import("./components/RestoreContent"))

// HomePage is just the two tabs now. The generate and restore flow logic lives
// in generateContext / restoreContext, where the state it drives already is.
const HomePage: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(0)

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
        {activeTabId === 0 ? (
          <Suspense>
            <GenerateContent />
          </Suspense>
        ) : (
          <Suspense>
            <RestoreContent />
          </Suspense>
        )}
      </div>
    </>
  )
}

export default HomePage
