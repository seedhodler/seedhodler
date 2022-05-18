import React from "react"
import CSS from "csstype"

import classes from "./Loader.module.scss"

type Props = {
  style?: CSS.Properties
}

const Loader: React.FC<Props> = ({ style }) => {
  return <div className={classes.ldsDualRing} style={style}></div>
}

export default Loader
