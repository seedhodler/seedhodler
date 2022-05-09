import React from "react"

import { ShareHeader } from "components/ShareHeader"

import classes from "../../PostModal.module.scss"

type Props = {
  shares: string[] | null
}

const BackupContent: React.FC<Props> = ({ shares }) => {
  return (
    <>
      <p className={classes.description}>
        Please carefully write down this phrase. <b>Keep it in a safe place!</b>
      </p>
      <ShareHeader text="Share - 1" style={{ marginBottom: "1.2rem" }} />
      <div className={classes.blockDivider}></div>
      <div></div>
    </>
  )
}

export default BackupContent
