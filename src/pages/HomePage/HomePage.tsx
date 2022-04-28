import React, { useState } from "react"

import GenerateIcon from "assets/icons/GenerateWithBg.svg"
import RestoreIcon from "assets/icons/RestoreWithBg.svg"

import { GenerateContent } from "./components/GenerateContent"
import { RestoreContent } from "./components/RestoreContent"
import { Tab } from "./components/Tab"
import classes from "./HomePage.module.scss"

const HomePage: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(0)

  return (
    <>
      <div className={classes.tabsContainer}>
        <Tab
          title="Generate"
          icon={GenerateIcon}
          active={activeTabId === 0}
          onClick={() => setActiveTabId(0)}
        />
        <Tab
          title="Restore"
          icon={RestoreIcon}
          active={activeTabId === 1}
          onClick={() => setActiveTabId(1)}
        />
      </div>
      <div className={classes.tabContent}>{activeTabId === 0 ? <GenerateContent /> : <RestoreContent />}</div>
    </>
  )
}

export default HomePage
