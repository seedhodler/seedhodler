import React from "react"

import classes from "./HelpModal.module.scss"

type Props = {
  children: React.ReactNode
  title: string
  isActive: boolean
}

const TabContent: React.FC<Props> = ({ children, title, isActive }) => {
  return (
    <>
      {isActive && (
        <div className={classes.activeContent}>
          <div className={classes.contentTitle}>
            <p className={classes.titleText}>{title}</p>
          </div>
          <div className={classes.contentText}>{children}</div>
        </div>
      )}
    </>
  )
}

export default TabContent
