import React from "react"

import NextIcon from "src/assets/icons/Next.svg"
import PrevIcon from "src/assets/icons/Prev.svg"
import { SchemeBadge } from "src/components/SchemeBadge"
import type { Scheme } from "src/core"

import classes from "./ShareCardHeader.module.scss"

type Props = {
  activeIndex: number
  total: number
  wordCount: number
  scheme?: Scheme
  onNavigate: (index: number) => void
  // Optional actions on the right (e.g. hide/print on the generate share card).
  // Left empty elsewhere, e.g. the verification modal, which needs neither.
  actions?: React.ReactNode
}

// The shared header for a share: title + scheme/word-count badges on the left,
// the prev/dots/next navigation centred, and an optional actions slot on the
// right. Used by the generate/restore share card and the verification modal so
// they read identically.
const ShareCardHeader: React.FC<Props> = ({
  activeIndex,
  total,
  wordCount,
  scheme,
  onNavigate,
  actions,
}) => {
  const showDots = total > 1
  // Many shares would grow the dots too wide for the row, so shrink them.
  const manyShares = total > 8

  const dots = []
  for (let i = 0; i < total; i++) {
    dots.push(
      <button
        key={i}
        onClick={() => onNavigate(i)}
        className={i === activeIndex ? classes.navigationItemActive : classes.navigationItem}
        aria-label={`Go to share ${i + 1}`}
        aria-current={i === activeIndex ? "true" : undefined}
      />,
    )
  }

  return (
    <div className={classes.sharesHeader}>
      <div className={classes.shareTitleGroup}>
        <h3 className={classes.shareTitle}>
          Share {activeIndex + 1} of {total}
        </h3>
        <div className={classes.shareMeta}>
          {scheme && <SchemeBadge scheme={scheme} />}
          <span className={`${classes.shareBadge} ${classes.shareBadgeCount}`}>{wordCount} words</span>
        </div>
      </div>
      {showDots && (
        <div
          className={`${classes.navigationContainer} ${manyShares ? classes.navigationContainerSmall : ""}`}
        >
          <button
            disabled={activeIndex <= 0}
            onClick={() => onNavigate(activeIndex - 1)}
            className={classes.navigationBtn}
            aria-label="Previous share"
          >
            <img src={PrevIcon} alt="" aria-hidden="true" />
          </button>
          <div className={classes.dotsRow}>{dots}</div>
          <button
            disabled={activeIndex >= total - 1}
            onClick={() => onNavigate(activeIndex + 1)}
            className={classes.navigationBtn}
            aria-label="Next share"
          >
            <img src={NextIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      )}
      {actions}
    </div>
  )
}

export default ShareCardHeader
