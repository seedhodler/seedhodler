import React from "react"

import classes from "./Select.module.scss"

const Select: React.FC = ({ ...restProps }) => {
  return (
    <div className={classes.selectContainer} {...restProps}>
      <select name="cars" className={classes.select}>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
      <span className={classes.customArrow}></span>
    </div>
  )
}

export default Select
