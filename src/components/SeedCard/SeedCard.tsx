import CSS from "csstype"
import React from "react"

import classes from "./SeedCard.module.scss"

type Props = {
  title: string
  // Word count for the badge (12 / 24, as number or string).
  wordCount: number | string
  // Optional controls on the right of the header (hide/print on generate, a
  // checkmark on the recovered seed).
  actions?: React.ReactNode
  children: React.ReactNode
  style?: CSS.Properties
}

// The framed master-seed card: a hairline-bordered card with a header (title +
// BIP-39 and word-count badges) and a divider, then its word grid. Shared by the
// generated seed and the recovered seed so they read identically.
const SeedCard: React.FC<Props> = ({ title, wordCount, actions, children, style }) => (
  <div className={classes.seedCard} style={style}>
    <div className={classes.seedHeaderRow}>
      <div className={classes.seedTitleGroup}>
        <h3 className={classes.seedTitle}>{title}</h3>
        <div className={classes.seedMeta}>
          <span className={`${classes.seedBadge} ${classes.seedBadgeType}`}>BIP-39</span>
          <span className={`${classes.seedBadge} ${classes.seedBadgeCount}`}>{wordCount} words</span>
        </div>
      </div>
      {actions && <div className={classes.seedActions}>{actions}</div>}
    </div>
    <div className={classes.blockDivider} />
    {children}
  </div>
)

export default SeedCard
