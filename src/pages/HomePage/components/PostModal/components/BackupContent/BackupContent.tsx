import React from "react"

import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { ShareHeader } from "components/ShareHeader"
import { TextPlace } from "components/TextPlace"
import { Button } from "components/Button"

import classes from "../../PostModal.module.scss"

type Props = {
  shares: string[]
}

const BackupContent: React.FC<Props> = ({ shares }) => {
  console.log(shares)

  return (
    <div className={classes.modalContentContainer}>
      <div style={{ width: "100%" }}>
        <p className={classes.description}>
          Please carefully write down this phrase. <b>Keep it in a safe place!</b>
        </p>
        <ShareHeader text="Share - 1" style={{ marginBottom: "1.2rem" }} />
        <div className={classes.blockDivider}></div>
        <div className={classes.textPlacesContainer}>
          {shares[0].split(" ").map((word, index) => (
            <TextPlace count={index + 1} text={word} style={{ margin: "0 auto", width: "19%" }} />
          ))}
        </div>
        <p className={classes.shareNumberInfo}>1 / 3 Shares</p>
        <p className={classes.additionalInfo}>
          We will confirm your written recovery phrase on the next screen.
        </p>
      </div>
      <Button onClick={() => {}} iconRight={ArrowRightIcon}>
        Next
      </Button>
    </div>
  )
}

export default BackupContent
