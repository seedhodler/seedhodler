import React, { useContext } from "react"
import { Link, Outlet } from "react-router-dom"

import CheckmarkFilledIcon from "src/assets/icons/CheckmarkFilled.svg"
import Logo from "src/assets/icons/Logo.svg"
import QuestionMarkIcon from "src/assets/icons/QuestionMark.svg?react"
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
  const heading = isRestore
    ? `Recover your seed in ${steps.length} steps`
    : `Back up your seed in ${steps.length} steps`

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
          <p className={classes.subtitle}>
            Seedhodler uses Shamir's Secret Sharing to split a wallet's master seed into several
            shares. You choose how many it takes to restore it, say any 3 of 5: fewer than that
            reveal nothing, while the number you set brings the whole seed back. So you can lose some
            shares and still recover, and a single stolen share stays worthless. Free and open source
            software.
          </p>
          <p className={classes.githubInfo}>
            In need of the source code?{" "}
            <a
              href="https://github.com/seedhodler/seedhodler"
              target="_blank"
              rel="noreferrer noopener"
              className={classes.link}
            >
              GitHub
            </a>
          </p>
          <p className={classes.githubInfo}>
            Want to run it air-gapped?{" "}
            <a
              href={SEEDHODLER_OS_RELEASES_URL}
              target="_blank"
              rel="noreferrer noopener"
              className={classes.link}
            >
              Seedhodler OS
            </a>
          </p>
          {/* A checklist wired to the flow's state: steps tick green as they are
              reached, so the list is real orientation instead of a decorative one
              that looks like progress but never moves (audit 05 / 04). */}
          <p className={classes.checklistHeading}>{heading}</p>
          <div className={classes.checklist}>
            {steps.map(step => (
              <div key={step.label} className={classes.checklistItem}>
                <span className={classes.checklistMark} aria-hidden="true">
                  {step.done ? (
                    <img src={CheckmarkFilledIcon} alt="" className={classes.checklistCheck} />
                  ) : (
                    <span className={classes.checklistDot} />
                  )}
                </span>
                <span className={classes.checklistText}>{step.label}</span>
                <span className={classes.visuallyHidden}>{step.done ? " (done)" : ""}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.navContentBottom}>
          <div className={classes.helpButtonContainer}>
            <button onClick={() => {
              setHelpModalOpen(true)
              setTab(helpChapters[0].id)
            }} className={classes.helpButton}>
              <QuestionMarkIcon />
              Help & getting started
            </button>
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