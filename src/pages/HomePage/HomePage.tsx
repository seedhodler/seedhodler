import React, { lazy, Suspense, useContext, useRef } from "react"

import GenerateIcon from "src/assets/icons/GenerateWithBg.svg"
import RestoreIcon from "src/assets/icons/RestoreWithBg.svg"
import { NavigationContext } from "src/context/navigationContext"

import { Tab } from "./components/Tab"
import classes from "./HomePage.module.scss"
const GenerateContent = lazy(() => import("./components/GenerateContent"))
const RestoreContent = lazy(() => import("./components/RestoreContent"))

// HomePage is just the two tabs now. The generate and restore flow logic lives
// in generateContext / restoreContext, where the state it drives already is.
const HomePage: React.FC = () => {
  const { activeTabId, setActiveTabId } = useContext(NavigationContext)
  const tablistRef = useRef<HTMLDivElement>(null)

  // Arrow-key navigation for the tablist (audit 14). Move selection and carry
  // focus to the newly selected tab, the roving-tabindex pattern.
  const onTablistKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const next = activeTabId === 0 ? 1 : 0
    setActiveTabId(next)
    requestAnimationFrame(() => {
      tablistRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
    })
  }

  return (
    <>
      <div
        className={classes.tabsContainer}
        role="tablist"
        aria-label="Generate or restore"
        ref={tablistRef}
        onKeyDown={onTablistKeyDown}
      >
        <Tab
          id="tab-generate"
          title="Generate"
          desc="Generate a BIP39 Master Seed and split it into shares"
          icon={GenerateIcon}
          active={activeTabId === 0}
          onClick={() => setActiveTabId(0)}
        />
        <Tab
          id="tab-restore"
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
