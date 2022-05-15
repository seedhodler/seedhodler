import React, { Dispatch, SetStateAction } from "react"

import CongratsIcon from "assets/icons/Congrats.svg"
import { Button } from "components/Button"

import classes from "../../ExportSaveModal.module.scss"

type Props = {
  setIsExportSaveModalActive: Dispatch<SetStateAction<boolean>>
}

const SuccessContent: React.FC<Props> = ({ setIsExportSaveModalActive }) => {
  return (
    <div className={classes.modalContentContainer}>
      <div style={{ width: "100%" }}>
        <p className={classes.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. __placeholder
        </p>
        <img
          src={CongratsIcon}
          alt="Congratulations"
          style={{ height: "200px", display: "block", margin: "0 auto 1.2rem" }}
        />
        <div className={classes.infoBlock}>
          <div className={classes.infoBlockHeader}>
            <p>Thank you note</p>
            {/* <img src={CloseOutlinedIcon} alt="Close" /> */}
          </div>
          <p className={classes.infoBlockDescription}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mollis donec gravida commodo vitae,
            id malesuada accumsan. Morbi in quisque ligula natoque faucibus. Volutpat orci, scelerisque
            sed a nulla. Tortor __placeholder
          </p>
        </div>
        <div className={classes.infoBlock}>
          <div className={classes.infoBlockHeader}>
            <p>Clear Cache / Potential Risks, Links</p>
            {/* <img src={CloseOutlinedIcon} alt="Close" /> */}
          </div>
          <p className={classes.infoBlockDescription}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mollis donec gravida commodo vitae,
            id malesuada accumsan. Morbi in quisque ligula natoque faucibus. Volutpat orci, scelerisque
            sed a nulla. Tortor __placeholder
          </p>
        </div>
      </div>
      <Button onClick={() => setIsExportSaveModalActive(false)}>Thank you for using Seedhodler</Button>
    </div>
  )
}

export default SuccessContent
