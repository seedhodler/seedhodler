import React, { Dispatch, SetStateAction } from "react"

import BinIcon from "src/assets/icons/Bin.svg"
import NextIcon from "src/assets/icons/Next.svg"
import PrevIcon from "src/assets/icons/Prev.svg"
import { Button } from "src/components/Button"
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
}

const Shares: React.FC<Props> = ({
  shares,
  activeShareItemId,
  setActiveShareItemId,
  scheme,
  isRestore,
  onDelete = () => {},
}) => {
  const navigation = []

  for (let i = 0; i < shares.length; i++) {
    navigation.push(
      <button
        key={i}
        onClick={() => setActiveShareItemId(i)}
        className={i === activeShareItemId ? classes.navigationItemActive : classes.navigationItem}
        aria-label={`Go to share ${i + 1}`}
        aria-current={i === activeShareItemId ? "true" : undefined}
      />,
    )
  }

  const words = shares[activeShareItemId].split(" ")

  return (
    <>
      <div className={classes.sharesContainer}>
        {/* Header mirrors the master seed card: title + badges on the left, the
            navigation on the right, so a share and the seed read alike. */}
        <div className={classes.sharesHeader}>
          <div className={classes.shareTitleGroup}>
            <h3 className={classes.shareTitle}>Share {activeShareItemId + 1}</h3>
            <div className={classes.shareMeta}>
              {scheme && (
                <span className={`${classes.shareBadge} ${classes.shareBadgeType}`}>
                  {scheme === "sskr" ? "SSKR" : "SLIP-39"}
                </span>
              )}
              <span className={`${classes.shareBadge} ${classes.shareBadgeCount}`}>
                {words.length} words
              </span>
              <span className={`${classes.shareBadge} ${classes.shareBadgeCount}`}>
                {activeShareItemId + 1} of {shares.length}
              </span>
            </div>
          </div>
          <div className={classes.shareNav}>
            <button
              disabled={activeShareItemId <= 0}
              onClick={() => setActiveShareItemId(prev => (prev <= 0 ? prev : --prev))}
              className={classes.navigationBtn}
              aria-label="Previous share"
            >
              <img src={PrevIcon} alt="" aria-hidden="true" />
            </button>
            <button
              disabled={activeShareItemId >= shares.length - 1}
              onClick={() => setActiveShareItemId(prev => (prev >= shares.length - 1 ? prev : ++prev))}
              className={classes.navigationBtn}
              aria-label="Next share"
            >
              <img src={NextIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className={classes.blockDivider} style={{ marginBottom: "2.4rem" }}></div>
        <div className={classes.shareItemsContainer}>
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
      {shares.length > 1 && <div className={classes.navigationContainer}>{navigation}</div>}
    </>
  )
}

export default Shares
