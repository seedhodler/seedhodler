import React, { Dispatch, SetStateAction, useState } from "react"

import BinIcon from "src/assets/icons/Bin.svg"
import { Button } from "src/components/Button"
import { CopyButton } from "src/components/CopyButton"
import { ShareCardHeader } from "src/components/ShareCardHeader"
import { TextPlace } from "src/components/TextPlace"
import { ButtonColorsEnum } from "src/constants/"
import type { Scheme } from "src/core"

import classes from "./Shares.module.scss"

type Props = {
  shares: string[]
  activeShareItemId: number
  setActiveShareItemId: Dispatch<SetStateAction<number>>
  scheme?: Scheme
  isRestore?: boolean
  onDelete?: () => void
  // When set, the header shows a print icon that prints the share form matching
  // this exact share (scheme + length). Only the generate side passes it.
  onPrint?: () => void
}

const Shares: React.FC<Props> = ({
  shares,
  activeShareItemId,
  setActiveShareItemId,
  scheme,
  isRestore,
  onDelete = () => {},
  onPrint,
}) => {
  const words = shares[activeShareItemId].split(" ")

  // Blur toggle for the share words, mirroring the seed card. A share is a
  // secret too; hide it for a screenshot or a glance.
  const [hidden, setHidden] = useState(false)

  return (
    <>
      <div className={classes.sharesContainer}>
        <ShareCardHeader
          activeIndex={activeShareItemId}
          total={shares.length}
          wordCount={words.length}
          scheme={scheme}
          onNavigate={setActiveShareItemId}
          actions={
            onPrint && (
              <div className={classes.shareActions}>
                <button
                  type="button"
                  className={classes.shareIconBtn}
                  onClick={() => setHidden(h => !h)}
                  aria-label={hidden ? "Reveal share" : "Hide share"}
                  title={hidden ? "Reveal share" : "Hide share"}
                >
                  {hidden ? (
                    // Open eye: click to reveal.
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    // Crossed-out eye: click to hide.
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
                <CopyButton
                  getText={() => words.join(" ")}
                  className={classes.shareIconBtn}
                  title="Copy share words"
                />
                <button
                  type="button"
                  className={classes.shareIconBtn}
                  onClick={onPrint}
                  aria-label="Print the matching share form"
                  title="Print the matching share form"
                >
                  {/* Printer: opens the print dialog with the matching share form pre-selected. */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                </button>
              </div>
            )
          }
        />
        <div className={classes.blockDivider} style={{ marginBottom: "2.4rem" }}></div>
        <div className={`${classes.shareItemsContainer} ${hidden ? classes.shareBlurred : ""}`}>
          {words.map((shareItem, index) => (
            <TextPlace
              key={index}
              text={shareItem}
              count={index + 1}
              className={classes.shareItem}
            />
          ))}
        </div>
        {isRestore && (
          <>
            <div className={classes.blockDivider} style={{ marginBottom: "2.4rem" }}></div>
            <div className={classes.bottomInfoContainer}>
              <Button onClick={onDelete} iconRight={BinIcon} color={ButtonColorsEnum.Neutral}>
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Shares
