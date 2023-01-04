import React, { Dispatch, SetStateAction } from "react"
import { Outlet, Link } from "react-router-dom"

import { ReactComponent as QuestionMarkIcon } from "assets/icons/QuestionMark.svg"
import Logo from "assets/icons/Logo.svg"
import { CheckmarkInfo } from "components/CheckmarkInfo"

import classes from "./Layout.module.scss"

type Props = {
  isOnline: boolean
  setIsHelpModalActive: Dispatch<SetStateAction<boolean>>
}

const Layout: React.FC<Props> = ({ isOnline, setIsHelpModalActive }) => {
  return (
    <div className={classes.mainContainer}>
      <nav className={classes.nav}>
        <div className={classes.navContentTop}>
          <Link to="/">
            <img src={Logo} alt="Seedhodler" className={classes.logo} />
          </Link>
          <p className={classes.subtitle}>
            Seedhodler is free and open source software. This project is currently a{" "}
            <b>work in progress</b> and should <b>not be used</b> by anyone for any reason whatsoever.
          </p>
          <p className={classes.githubInfo}>
            In need of the source code?{" "}
            <a
              href="https://github.com/seedhodler/seedhodlerV2/tree/main"
              target="_blank"
              rel="noreferrer noopener"
              className={classes.link}
            >
              GitHub
            </a>
          </p>
          <CheckmarkInfo isCheckmark={false}>Easily Generate your seed recovery phrase</CheckmarkInfo>
          <CheckmarkInfo isCheckmark={false}>Restore your recovery phrase</CheckmarkInfo>
          <CheckmarkInfo isCheckmark={false}>Edit your key Entropy</CheckmarkInfo>
          <CheckmarkInfo isCheckmark={false}>Secure when used Offline</CheckmarkInfo>
          <CheckmarkInfo isCheckmark={false}>Split phrases and share with others</CheckmarkInfo>
        </div>
        <div className={classes.helpButtonContainer}>
          <button onClick={() => setIsHelpModalActive(prev => !prev)} className={classes.helpButton}>
            <QuestionMarkIcon />
            Help & getting started
          </button>
        </div>
      </nav>

      <div className={classes.mainContentContainer}>
        {isOnline && (
          <div className={classes.onlineNotification}>
            <p className={classes.title} style={{ marginBottom: 0, minWidth: "105px" }}>
              Security Notice
            </p>
            <p className={classes.onlineMessage}>
              You are currently online. This tool should only be used in an offline environment
            </p>
          </div>
        )}
        <main className={classes.contentContainer}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
