import React, { Dispatch, SetStateAction } from "react"

import BinIcon from "src/assets/icons/Bin.svg"
import NextIcon from "src/assets/icons/Next.svg"
import PrevIcon from "src/assets/icons/Prev.svg"
import { Button } from "src/components/Button"
import { TextPlace } from "src/components/TextPlace"
import { ButtonColorsEnum } from "src/constants/"

import classes from "./Shares.module.scss"

type Props = {
  shares: string[]
  activeShareItemId: number
  setActiveShareItemId: Dispatch<SetStateAction<number>>
  isRestore?: boolean
  onDelete?: () => void
}

const Shares: React.FC<Props> = ({
  shares,
  activeShareItemId,
  setActiveShareItemId,
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

  return (
    <>
      <div className={classes.sharesContainer}>
        <div className={classes.sharesHeader}>
          <button
            disabled={activeShareItemId <= 0}
            onClick={() => setActiveShareItemId(prev => (prev <= 0 ? prev : --prev))}
            className={classes.navigationBtn}
            aria-label="Previous share"
          >
            <img src={PrevIcon} alt="" aria-hidden="true" />
          </button>
          <div className={classes.shareNumberContainer}>
            <div className={classes.dot}></div>
            <h3 className={classes.shareNumberHeader}>Share - {activeShareItemId + 1}</h3>
          </div>
          <button
            disabled={activeShareItemId >= shares.length - 1}
            onClick={() => setActiveShareItemId(prev => (prev >= shares.length - 1 ? prev : ++prev))}
            className={classes.navigationBtn}
            aria-label="Next share"
          >
            <img src={NextIcon} alt="" aria-hidden="true" />
          </button>
        </div>
        <div className={classes.blockDivider} style={{ marginBottom: "2.4rem" }}></div>
        <div className={classes.shareItemsContainer}>
          {shares[activeShareItemId].split(" ").map((shareItem, index) => (
            <TextPlace
              key={index}
              text={shareItem}
              count={index + 1}
              className={classes.shareItem}
            />
          ))}
        </div>
        <div className={classes.blockDivider} style={{ marginBottom: "2.4rem" }}></div>

        <div className={classes.bottomInfoContainer}>
          <p className={classes.shareNumberText}>
            {activeShareItemId + 1}/{shares.length} splits
          </p>
          {isRestore && (
            <Button onClick={onDelete} iconRight={BinIcon} color={ButtonColorsEnum.Neutral}>
              Delete
            </Button>
          )}
        </div>
      </div>
      {shares.length > 1 && <div className={classes.navigationContainer}>{navigation}</div>}
    </>
  )
}

export default Shares
