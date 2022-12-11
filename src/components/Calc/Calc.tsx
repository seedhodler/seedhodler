import React from "react"

import AddIcon from "assets/icons/Add.svg"
import RemoveIcon from "assets/icons/Remove.svg"

import classes from "./Calc.module.scss"

type Props = {
  value: number
  plusDisabled?: boolean
  minusDisabled?: boolean
  onPlus: () => void
  onMinus: () => void
}

const Calc: React.FC<Props> = ({ value, plusDisabled, minusDisabled, onPlus, onMinus }) => {
  return (
    <div className={classes.mainContainer}>
      <button onClick={onMinus} disabled={minusDisabled} className={classes.btnMinus}>
        <img src={RemoveIcon} alt="Minus" className={classes.icon} />
      </button>
      <span className={classes.value}>{value}</span>
      <button onClick={onPlus} disabled={plusDisabled} className={classes.btnPlus}>
        <img src={AddIcon} alt="Plus" className={classes.icon} />
      </button>
    </div>
  )
}

export default Calc
