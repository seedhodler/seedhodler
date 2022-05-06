import React, { Dispatch, SetStateAction } from "react"

import PrevIcon from "assets/icons/Prev.svg"
import NextIcon from "assets/icons/Next.svg"

import classes from "./Shares.module.scss"

type Props = {
  shares: string[]
  activeShareItemId: number
  setActiveShareItemId: Dispatch<SetStateAction<number>>
  selectedWordCount: number
}

const Shares: React.FC<Props> = ({
  shares,
  activeShareItemId,
  setActiveShareItemId,
  selectedWordCount,
}) => {
  const navigation = []

  for (let i = 0; i < shares.length; i++) {
    navigation.push(
      <button
        key={i}
        onClick={() => setActiveShareItemId(i)}
        className={i === activeShareItemId ? classes.navigationItemActive : classes.navigationItem}
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
          >
            <img src={PrevIcon} alt="Arrow left" />
          </button>
          <div className={classes.shareNumberContainer}>
            <div className={classes.mark}></div>
            <span className={classes.shareNumberHeader}>Share - {activeShareItemId + 1}</span>
          </div>
          <button
            disabled={activeShareItemId >= shares.length - 1}
            onClick={() => setActiveShareItemId(prev => (prev >= shares.length - 1 ? prev : ++prev))}
            className={classes.navigationBtn}
          >
            <img src={NextIcon} alt="Arrow right" />
          </button>
        </div>
        <div className={classes.blockDivider} style={{ marginBottom: "2.4rem" }}></div>
        <div
          className={classes.shareItemsContainer}
          style={{ height: selectedWordCount === 12 ? "560px" : "960px" }}
        >
          {shares[activeShareItemId].split(" ").map((shareItem, index) => (
            <div
              key={index}
              className={classes.shareItem}
              style={{
                alignSelf: index <= (selectedWordCount === 12 ? 9 : 16) ? "flex-start" : "flex-end",
              }}
            >
              <span className={classes.shareItemCount}>{++index}.</span>
              {shareItem}
            </div>
          ))}
        </div>
        <div className={classes.blockDivider} style={{ marginBottom: "2.4rem" }}></div>
        <p className={classes.shareNumberText}>
          {activeShareItemId + 1}/{shares.length} splits
        </p>
      </div>
      <div className={classes.navigationContainer}>{navigation}</div>
    </>
  )
}

export default Shares
