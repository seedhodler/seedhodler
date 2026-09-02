import React from "react"

import classes from "./ConnectionStatus.module.scss"

type Props = {
  isOnline: boolean
}

// A calm, always-visible connection indicator. It replaces the full-width red
// bar that slapped every online visitor before they had done anything. Online is
// a recoverable state (disconnect and it clears), so it gets amber, not the red
// reserved for the irreversible cross-use mistake. The loud red warning fires
// elsewhere, only when a secret is actually on screen while online.
const ConnectionStatus: React.FC<Props> = ({ isOnline }) => {
  return (
    <div className={classes.container}>
      <span
        className={`${classes.pill} ${isOnline ? classes.online : classes.offline}`}
        title={
          isOnline
            ? "A seed handled on an online computer is not safe, now or later. Only a machine that stays offline the whole time is safe, such as the Seedhodler live ISO."
            : "You are offline. This is the safe state for handling a seed and shares."
        }
      >
        <span className={classes.dot} aria-hidden="true" />
        {isOnline ? "Online · only safe offline" : "Offline"}
      </span>
    </div>
  )
}

export default ConnectionStatus
