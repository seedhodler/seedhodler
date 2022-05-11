import React, { useState } from "react"

import { TextPlace } from "components/TextPlace"

import classes from "./PrintPage.module.scss"

const PrintPage: React.FC = () => {
  const fills = {
    12: "1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0",
    24: "1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3",
  }

  const [selectedWordCount] = useState(12)
  const shares: string[] = new Array(selectedWordCount).fill(
    fills[selectedWordCount as keyof typeof fills],
  )

  return (
    <div className={classes.container}>
      <div className={classes.sharesContainer}>
        <div className={classes.sharesHeader}>
          <div className={classes.shareNumberContainer}>
            <div className={classes.dot}></div>
            <span className={classes.shareNumberHeader}>Share - __</span>
          </div>
        </div>
        <div className={classes.blockDivider} style={{ marginBottom: "2.4rem" }}></div>
        <div
          className={classes.shareItemsContainer}
          style={{ height: selectedWordCount === 12 ? "560px" : "960px" }}
        >
          {shares[0].split(" ").map((shareItem, index) => (
            <TextPlace
              key={index}
              text=""
              count={index + 1}
              style={{
                alignSelf: index <= (selectedWordCount === 12 ? 9 : 16) ? "flex-start" : "flex-end",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PrintPage
