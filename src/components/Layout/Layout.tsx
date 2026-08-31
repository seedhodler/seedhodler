import React, { Dispatch, SetStateAction, useContext } from "react"
import { Link, Outlet } from "react-router-dom"

import InfoRed from "src/assets/icons/InfoRed.svg"

import Logo from "src/assets/icons/Logo.svg"
import QuestionMarkIcon from "src/assets/icons/QuestionMark.svg?react"
import CheckmarkInfo from "src/components/CheckmarkInfo"
import { NavFeaturedCard } from "src/components/_NavFeaturedCard"

import { HelpModalTabs } from "src/constants"
import { HelpModalContext } from "src/context/HelpModalContext"
import classes from "./Layout.module.scss"
import BuildStamp from "src/components/BuildStamp"

type Props = {
  isOnline: boolean
  showWarning: boolean
  setShowWarning: Dispatch<SetStateAction<boolean>>
}

const Layout: React.FC<Props> = ({
  isOnline,
  showWarning,
  setShowWarning,
}) => {
  const { setIsOpen: setHelpModalOpen, setTab } = useContext(HelpModalContext)

  return (
    <div className={classes.mainContainer}>
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
          <CheckmarkInfo isCheckmark={false}>Generate your own BIP39 Master Seed</CheckmarkInfo>
          <CheckmarkInfo isCheckmark={false}>Manually enter your own entropy</CheckmarkInfo>
          <CheckmarkInfo isCheckmark={false}>Split your master seed using SSS</CheckmarkInfo>
          <CheckmarkInfo isCheckmark={false}>Print templates and fill split words</CheckmarkInfo>
          <CheckmarkInfo isCheckmark={false}>Restore your master seed</CheckmarkInfo>
        </div>
        <div className={classes.navContentBottom}>
          {showWarning ? (
            <NavFeaturedCard />
          ) : null}
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
        {isOnline ? (
          <div className={classes.onlineNotification}>
            <div className={classes.notificationBox}>
              <p className={classes.title} style={{ marginBottom: 0, minWidth: "105px" }}>
                Security Notice
              </p>
              <img src={InfoRed} alt="InfoRed" />
            </div>
            <p className={classes.onlineMessage}>
              You are currently online. This tool can only be considered safe in an offline environment
            </p>
          </div>
        ) : (
          <div className={classes.offlineNotification}>
            <p className={classes.offlineMessage}>You are currently offline.</p>
          </div>
        )}
        <main className={classes.contentContainer}>
          <Outlet />
        </main>
        <BuildStamp />
      </div>
    </div>
  )
}

export default Layout