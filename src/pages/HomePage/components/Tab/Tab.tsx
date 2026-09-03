import React from "react"

import InfoGrayIcon from "src/assets/icons/InfoGray.svg"
import { Tooltip } from "src/components/Tooltip"

import classes from "./Tab.module.scss"

type Props = {
  title: string
  desc: string
  icon: string
  active?: boolean
  onClick: () => void
  id?: string
}

const Tab: React.FC<Props> = ({ title, desc, icon, active, onClick, id }) => {
  const className = active ? classes.tabActive : classes.tab

  return (
    <div
      id={id}
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      className={className}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <img src={icon} alt="" aria-hidden="true" className={classes.icon} />
      <div className={classes.tabLabel}>
        {title}
        {/* Instant styled bubble to match the rest of the interface, replacing the
            slow native title. stopPropagation so opening the tooltip does not also
            switch tabs. */}
        <Tooltip content={desc} label={`About the ${title} tab`}>
          <span onClick={e => e.stopPropagation()}>
            <img src={InfoGrayIcon} alt="" aria-hidden="true" className={classes.infoIcon} />
          </span>
        </Tooltip>
      </div>
    </div>
  )
}

export default Tab
