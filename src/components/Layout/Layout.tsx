import React, { useContext } from "react"
import { Link, Outlet } from "react-router-dom"

import Logo from "src/assets/icons/Logo.svg"
import QuestionMarkIcon from "src/assets/icons/QuestionMark.svg?react"
import { ConnectionStatus } from "src/components/ConnectionStatus"

import { HelpModalTabs } from "src/constants"
import { HelpModalContext } from "src/context/HelpModalContext"
import classes from "./Layout.module.scss"
import BuildStamp from "src/components/BuildStamp"

type Props = {
  isOnline: boolean
}

const Layout: React.FC<Props> = ({
  isOnline,
}) => {
  const { setIsOpen: setHelpModalOpen, setTab } = useContext(HelpModalContext)

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
          <p className={classes.subtitle}>
            Seedhodler is a tool that uses Shamir's secret sharing to generate, split, and rejoin master
            seeds for cryptocurrency wallets. By Splitting a master seed into shares and distributing
            them on various safe locations we are removing a single point of failure in the crypto
            toolchain by decentralizing it. Seedhodler is free and open source software.
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
          {/* A plain capability list, not a progress tracker (audit 05): a real
              <ul> with a heading and muted bullets, so nobody waits for a step to
              light up or become clickable. */}
          <p className={classes.featuresHeading}>What you can do</p>
          <ul className={classes.features}>
            <li>Generate your own BIP39 Master Seed</li>
            <li>Manually enter your own entropy</li>
            <li>Split your master seed using SSS</li>
            <li>Print templates and fill split words</li>
            <li>Restore your master seed</li>
          </ul>
        </div>
        <div className={classes.navContentBottom}>
          <div className={classes.helpButtonContainer}>
            <button onClick={() => {
              setHelpModalOpen(true)
              setTab(HelpModalTabs.Introduction)
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