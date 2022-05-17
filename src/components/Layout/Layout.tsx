import React from "react"
import { Outlet } from "react-router-dom"

import QuestionMarkIcon from "assets/icons/QuestionMark.svg"
import Logo from "assets/icons/Logo.svg"
import { InfoTitle } from "components/InfoTitle"
import { CheckmarkInfo } from "components/CheckmarkInfo"

import classes from "./Layout.module.scss"

type Props = {
  isOnline: boolean
}

const Layout: React.FC<Props> = ({ isOnline }) => {
  return (
    <div className={classes.mainContainer}>
      <nav className={classes.nav}>
        <div>
          <img src={Logo} alt="Seedhodler" className={classes.logo} />
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
          <CheckmarkInfo>Easily Generate your seed recovery phrase</CheckmarkInfo>
          <CheckmarkInfo>Restore your recovery phrase</CheckmarkInfo>
          <CheckmarkInfo>Edit your key Entropy</CheckmarkInfo>
          <CheckmarkInfo>Secure when used Offline</CheckmarkInfo>
          <CheckmarkInfo>Split phrases and share with others</CheckmarkInfo>
        </div>
        <CheckmarkInfo iconLeft={QuestionMarkIcon} additionalInfo="4" className={classes.bottomMenu}>
          Help & getting started
        </CheckmarkInfo>
      </nav>

      <div className={classes.mainContentContainer}>
        {isOnline && (
          <div className={classes.onlineNotification}>
            <InfoTitle
              title="Security Notice"
              desc="Security Notice __placeholder"
              className={classes.securityNotice}
            />
            <p className={classes.onlineMessage}>
              You are currently online. This tool should only be used when offline
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
