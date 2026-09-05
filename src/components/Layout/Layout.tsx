import React, { useContext } from "react"
import { Link, Outlet } from "react-router-dom"

import CheckmarkFilledIcon from "src/assets/icons/CheckmarkFilled.svg"
import Logo from "src/assets/icons/Logo.svg"
import QuestionMarkIcon from "src/assets/icons/QuestionMark.svg?react"
import GitHubIcon from "src/assets/icons/GitHub.svg?react"
import { ConnectionStatus } from "src/components/ConnectionStatus"

import { helpChapters } from "src/constants"
import { SEEDHODLER_OS_RELEASES_URL } from "src/constants/config"
import { GenerateContext } from "src/context/generateContext"
import { HelpModalContext } from "src/context/HelpModalContext"
import { NavigationContext } from "src/context/navigationContext"
import { RestoreContext } from "src/context/restoreContext"
import classes from "./Layout.module.scss"
import BuildStamp from "src/components/BuildStamp"

type Props = {
  isOnline: boolean
}

const Layout: React.FC<Props> = ({
  isOnline,
}) => {
  const { setIsOpen: setHelpModalOpen, setTab } = useContext(HelpModalContext)
  const { activeTabId } = useContext(NavigationContext)
  const { mnemonic, shares, hasPrintedShares, hasVerified, hasPrintedInserts } =
    useContext(GenerateContext)
  const { enteredShares, isFullMnemonic } = useContext(RestoreContext)

  // A checklist wired to the flow's state (audit 05 / 04): steps tick green as the
  // user reaches them, so the sidebar is real orientation, not a decorative list.
  const seedDone = mnemonic.length > 0 && mnemonic.every(word => word.length > 0)
  const isRestore = activeTabId === 1
  const steps = isRestore
    ? [
        { label: "Enter your shares", done: enteredShares.length > 0 },
        { label: "Recover your Master Seed", done: isFullMnemonic },
      ]
    : [
        { label: "Generate your Master Seed", done: seedDone },
        { label: "Split it into shares", done: shares !== null },
        { label: "Print the forms, write the shares down", done: hasPrintedShares },
        { label: "Verify your shares", done: hasVerified },
        { label: "Fill the custody inserts", done: hasPrintedInserts },
      ]
  const sectionLabel = isRestore ? "Recover your seed" : "Back up your seed"
  // The current step is the first one not yet done; earlier steps show a check,
  // later ones an open ring. Gives real "where am I" orientation, not a binary tick.
  const currentIndex = steps.findIndex(step => !step.done)

  return (
    <div className={classes.mainContainer}>
      <a href="#main-content" className={classes.skipLink}>
        Skip to main content
      </a>
      <h1 className={classes.visuallyHidden}>Seedhodler</h1>
      <nav className={classes.nav}>
        <div className={classes.navContentTop}>
          <Link to="/">
            <img src={Logo} alt="Seedhodler" className={classes.logo} />
          </Link>
          <p className={classes.tagline}>Split the seed. Spread the risk.</p>
          <p className={classes.intro}>
            Split a wallet's master seed into{" "}
            <a
              href="https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing"
              target="_blank"
              rel="noreferrer noopener"
              className={classes.introLink}
            >
              Shamir shares
            </a>
            . Losing some is survivable, and a single stolen share stays worthless.
          </p>
          {/* A checklist wired to the flow's state (audit 05 / 04): each step is
              done, current or upcoming, so the sidebar is real orientation rather
              than a decorative list that never moves. */}
          <p className={classes.sectionLabel}>{sectionLabel}</p>
          <div className={classes.checklist}>
            {steps.map((step, i) => {
              const state = step.done ? "done" : i === currentIndex ? "current" : "todo"
              const textClass =
                state === "done"
                  ? classes.stepDone
                  : state === "current"
                    ? classes.stepCurrent
                    : classes.stepTodo
              return (
                <div key={step.label} className={classes.checklistItem}>
                  <span className={classes.checklistMark} aria-hidden="true">
                    {state === "done" ? (
                      <img src={CheckmarkFilledIcon} alt="" className={classes.checklistCheck} />
                    ) : state === "current" ? (
                      <span className={classes.checklistCurrent} />
                    ) : (
                      <span className={classes.checklistDot} />
                    )}
                  </span>
                  <span className={`${classes.checklistText} ${textClass}`}>{step.label}</span>
                  <span className={classes.visuallyHidden}>
                    {state === "done" ? " (done)" : state === "current" ? " (current step)" : ""}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div className={classes.navContentBottom}>
          <div className={classes.helpButtonContainer}>
            <button onClick={() => {
              setHelpModalOpen(true)
              setTab(helpChapters[0].id)
            }} className={classes.helpButton}>
              <span className={classes.helpIconSlot}>
                <QuestionMarkIcon />
              </span>
              Help & getting started
            </button>
          </div>
          {/* Meta links, grouped with Help under the one footer divider and on
              the same left rail. GitHub shows its mark plus a label so it aligns
              with the help row; Seedhodler OS is the offline live system. */}
          <div className={classes.metaLinks}>
            <a
              href="https://github.com/seedhodler/seedhodler"
              target="_blank"
              rel="noreferrer noopener"
              className={classes.metaLink}
              title="Source code on GitHub"
            >
              <span className={classes.metaRail} aria-hidden="true">
                <GitHubIcon />
              </span>
              GitHub
            </a>
            <span className={classes.metaSeparator} aria-hidden="true" />
            <a
              href={SEEDHODLER_OS_RELEASES_URL}
              target="_blank"
              rel="noreferrer noopener"
              className={classes.metaLink}
              title="Run it air-gapped: download Seedhodler OS"
            >
              Seedhodler OS
            </a>
          </div>
        </div>
      </nav>

      <div className={classes.mainContentContainer}>
        <ConnectionStatus isOnline={isOnline} />
        <main id="main-content" tabIndex={-1} className={classes.contentContainer}>
          <Outlet />
        </main>
        <BuildStamp />
      </div>
    </div>
  )
}

export default Layout