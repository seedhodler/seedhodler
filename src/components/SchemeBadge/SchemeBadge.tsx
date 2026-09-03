import React from "react"

import type { Scheme } from "src/core"

import classes from "./SchemeBadge.module.scss"

type Props = {
  scheme: Scheme
  className?: string
  // A slightly smaller pill for dense contexts, e.g. the print dialog rows.
  small?: boolean
}

// One pill with one colour per scheme, used everywhere a share's scheme is shown
// so SLIP-39 (violet) and SSKR (green) are told apart at a glance across the app.
const SchemeBadge: React.FC<Props> = ({ scheme, className, small }) => (
  <span
    className={[
      classes.badge,
      small ? classes.small : "",
      scheme === "sskr" ? classes.sskr : classes.slip39,
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {scheme === "sskr" ? "SSKR" : "SLIP-39"}
  </span>
)

export default SchemeBadge
