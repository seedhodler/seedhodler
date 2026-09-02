import React, { ReactNode, useId } from "react"

import InfoGrayIcon from "src/assets/icons/InfoGray.svg"

import classes from "./Tooltip.module.scss"

type Props = {
  // The text shown in the bubble.
  content: ReactNode
  // The hover/focus target. Defaults to the gray info icon.
  children?: ReactNode
  // Accessible name for the default icon trigger (ignored when children are given).
  label?: string
  className?: string
}

// A tooltip that appears with no delay, unlike the native title attribute which
// browsers hold back for up to ~1.5s and which cannot be sped up. Shows on hover
// and on keyboard focus; the bubble is linked to the trigger via aria-describedby
// so screen readers announce it. Pure CSS visibility (:hover / :focus-within),
// so there is no timer to wait on.
const Tooltip: React.FC<Props> = ({ content, children, label = "More information", className }) => {
  const id = useId()
  const classNames = [classes.tooltip, className].filter(Boolean).join(" ")

  return (
    <span className={classNames}>
      <button type="button" className={classes.trigger} aria-label={label} aria-describedby={id}>
        {children ?? <img src={InfoGrayIcon} alt="" aria-hidden="true" />}
      </button>
      <span role="tooltip" id={id} className={classes.bubble}>
        {content}
      </span>
    </span>
  )
}

export default Tooltip
