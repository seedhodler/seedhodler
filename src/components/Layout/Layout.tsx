import React from "react"
import { Outlet } from "react-router-dom"

import EllipseIcon from "assets/icons/Ellipse.svg"

import CheckmarkInfo from "./CheckmarkInfo"
import classes from "./Layout.module.scss"

const Layout = () => {
  return (
    <div className={classes.mainContainer}>
      <nav className={classes.nav}>
        <div>
          <div className={classes.mainTitleContainer}>
            <img src="" alt="Seedhodler" />
            <p className={classes.mainTitle}>seedhodler</p>
          </div>
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
        <CheckmarkInfo iconLeft={EllipseIcon} additionalInfo="4" className={classes.bottomMenu}>
          Help & getting started
        </CheckmarkInfo>
      </nav>

      <Outlet />
    </div>
  )
}

export default Layout
