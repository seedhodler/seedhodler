import React from "react"

import InfoGrayIcon from "assets/icons/InfoGray.svg"

import classes from "./Tab.module.scss"

type Props = {
  title: string
  icon: string
  active?: boolean
  onClick: () => void
}

const Tab: React.FC<Props> = ({ title, icon, active, onClick }) => {
  const className = active ? classes.tabActive : classes.tab

  return (
    <div className={className} onClick={onClick}>
      <img src={icon} alt={title} className={classes.icon} />
      <div>
        {title}
        <img src={InfoGrayIcon} alt="Info" className={classes.infoIcon} />
      </div>
    </div>
  )
}

export default Tab
