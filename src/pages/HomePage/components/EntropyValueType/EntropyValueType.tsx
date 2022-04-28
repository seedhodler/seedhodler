import React from "react"

import classes from "./EntropyValueType.module.scss"

type Props = {
  title: string
  subtitle: string
  icon: string
}

const EntropyValueType: React.FC<Props> = ({ title, subtitle, icon }) => {
  return (
    <div className={classes.container}>
      <img src={icon} alt="Entropy item" style={{ marginRight: "1.2rem", color: "#e90e0e" }} />
      <div>
        <p className={classes.subtitle}>{subtitle}</p>
        <p className={classes.title}>{title}</p>
      </div>
    </div>
  )
}

export default EntropyValueType
