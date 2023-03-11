import React, { Dispatch, SetStateAction } from "react"

import CompleteIcon from "assets/icons/CompleteIcon.svg"
import CompleteImage from "assets/icons/CompleteImg.png"
import { Button } from "components/Button"

import classes from "./CompleteScreen.module.scss"

type Props = {
  setIsExportSaveModalActive: Dispatch<SetStateAction<boolean>>
}

const CompleteScreen: React.FC<Props> = ({ setIsExportSaveModalActive }) => {
  return (
    <div className={classes.contentBody}>
      <div className={classes.iconBox}>
        <img src={CompleteIcon} alt="Seedhodler Icon" className={classes.icon} />
      </div>
      <div style={{ width: "100%" }}>
        <div className={classes.contentContainer}>
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <img src={CompleteImage} alt="Congratulations" className={classes.imageBox} />
          </div>
          <div className={classes.title}>
            <p className={classes.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mollis donec gravida commodo
              vitae, id malesuada accumsan. Morbi in quisque ligula natoque faucibus. Volutpat orci,
              scelerisque sed a nulla. Tortor consequat.
            </p>
          </div>
          <div className={classes.info}>
            <div className={classes.infoBox}>
              <div className={classes.links}>
                <p className={classes.link}>Clear Cache / Potential Risks, Links</p>
              </div>
              <hr className={classes.divider} />
            </div>
            <p className={classes.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mollis donec gravida commodo
              vitae, id malesuada accumsan. Morbi in quisque ligula natoque faucibus. Volutpat orci,
              scelerisque sed a nulla. Tortor consequat.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Button
              style={{ background: "#73b355", order: 3 }}
              onClick={() => setIsExportSaveModalActive(false)}
            >
              Thank you for using Seedhodler
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompleteScreen
