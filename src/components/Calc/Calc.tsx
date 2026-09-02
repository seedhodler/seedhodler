import React from "react"

import AddIcon from "src/assets/icons/Add.svg"
import RemoveIcon from "src/assets/icons/Remove.svg"

import classes from "./Calc.module.scss"

type Props = {
  value: number
  // Names the quantity so the two identical +/- pairs (threshold, shares) get
  // distinct accessible labels, e.g. "Increase threshold" vs "Increase shares".
  itemLabel: string
  plusDisabled?: boolean
  minusDisabled?: boolean
  onPlus: () => void
  onMinus: () => void
}

const Calc: React.FC<Props> = ({ value, itemLabel, plusDisabled, minusDisabled, onPlus, onMinus }) => {
  return (
    <div className={classes.mainContainer}>
      <button
        onClick={onMinus}
        disabled={minusDisabled}
        className={classes.btnMinus}
        aria-label={`Decrease ${itemLabel}`}
      >
        <img src={RemoveIcon} alt="" aria-hidden="true" className={classes.icon} />
      </button>
      <span className={classes.value}>{value}</span>
      <button
        onClick={onPlus}
        disabled={plusDisabled}
        className={classes.btnPlus}
        aria-label={`Increase ${itemLabel}`}
      >
        <img src={AddIcon} alt="" aria-hidden="true" className={classes.icon} />
      </button>
    </div>
  )
}

export default Calc
