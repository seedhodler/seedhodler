import React from "react"

import AddIcon from "assets/icons/Add.svg"
import RemoveIcon from "assets/icons/Remove.svg"

import classes from "./Calc.module.scss"

type Props = {
  value: number
  onPlus: () => void
  onMinus: () => void
}

const Calc: React.FC<Props> = ({ value, onPlus, onMinus }) => {
  return (
    <div className={classes.mainContainer}>
      <button onClick={onMinus} disabled={value <= 0} className={classes.btnMinus}>
        <img src={RemoveIcon} alt="Minus" />
      </button>
      <span className={classes.value}>{value}</span>
      <button onClick={onPlus} disabled={value >= 6} className={classes.btnPlus}>
        <img src={AddIcon} alt="Plus" />
      </button>
    </div>
  )
}

export default Calc
