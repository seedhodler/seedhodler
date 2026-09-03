import React from "react"

import variables from "src/styles/Variables.module.scss"

import classes from "./EntropyValueType.module.scss"

type Props = {
  title: string
  subtitle: string
  icon: string
  isActive: boolean
  onClick: () => void
}

const EntropyValueType: React.FC<Props> = ({ title, subtitle, icon, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={classes.container}
      style={{ border: isActive ? `2px solid ${variables.colorMain}` : "" }}
    >
      <img src={icon} alt="" aria-hidden="true" className={classes.icon} />
      <div>
        <p className={classes.subtitle}>{subtitle}</p>
        <p className={classes.title}>{title}</p>
      </div>
    </div>
  )
}

export default EntropyValueType
