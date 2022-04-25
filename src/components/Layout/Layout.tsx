import React from "react"
import { Outlet } from "react-router-dom"

import QuestionMarkIcon from "assets/icons/QuestionMark.svg"
import Logo from "assets/icons/Logo.svg"

import CheckmarkInfo from "./CheckmarkInfo"
import classes from "./Layout.module.scss"

const Layout = () => {
  return (
    <div className={classes.mainContainer}>
      <nav className={classes.nav}>
        <div>
          <img src={Logo} alt="Seedhodler" className={classes.logo} />
          <p className={classes.subtitle}>
            Seedhodler is free and open source software. This project is currently a <b>work in progress</b>
            and should <b>not be used</b> by anyone for any reason whatsoever.
          </p>
          <p className={classes.githubInfo}>
            In need of the source code?{" "}
            <a
              href="https://code.alphax.digital/karen.mu/seedhodler"
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

      <main className={classes.contentContainer}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
