import React, { useContext } from "react"

import InfoGrayIcon from "src/assets/icons/InfoGray.svg"
import InfoRed from "src/assets/icons/InfoRed.svg"
import { HelpModalTabs } from "src/constants"
import { HelpModalContext } from "src/context/HelpModalContext"
import type { Scheme } from "src/core"

import classes from "./SchemeNotice.module.scss"

type Props = {
  selectedScheme: Scheme
}

// The cross-use safety warning, inline at the point where the scheme is chosen.
// It used to live in the sidebar card, which is dropped below 640px, so the one
// warning about the mistake that silently opens an empty wallet was missing on
// phones. Here it sits in the main column and stays visible on every size.
//
// Wording and severity follow the scheme: SLIP-39 shares look like a Trezor
// Shamir seed and are genuinely dangerous in a device, so they get the danger
// treatment; SSKR shares are rejected by hardware wallets and cannot open the
// wrong wallet, so their note is a calmer caution. The tooltip beside the
// selector carries the neutral "what is this scheme" explanation; this carries
// the warning.
const SchemeNotice: React.FC<Props> = ({ selectedScheme }) => {
  const { setTab, setIsOpen } = useContext(HelpModalContext)
  const openFullWarning = () => {
    setTab(HelpModalTabs.Warning)
    setIsOpen(true)
  }

  const isSlip39 = selectedScheme === "slip39"

  return (
    <div className={`${classes.notice} ${isSlip39 ? classes.danger : classes.note}`}>
      <img
        src={isSlip39 ? InfoRed : InfoGrayIcon}
        alt=""
        aria-hidden="true"
        className={classes.icon}
      />
      <p className={classes.text}>
        {isSlip39 ? (
          <>
            <b>Never enter these shares into a Trezor or any hardware wallet.</b> SLIP-39 shares
            here encode your BIP-39 entropy, not a device seed: a hardware wallet would open a
            different, empty wallet from them.
          </>
        ) : (
          <>
            <b>A hardware wallet rejects SSKR shares by design</b>, so they cannot open the wrong
            wallet. Restore them here or with any Blockchain Commons tool.
          </>
        )}{" "}
        <button type="button" className={classes.moreLink} onClick={openFullWarning}>
          Read the full warning
        </button>
      </p>
    </div>
  )
}

export default SchemeNotice
