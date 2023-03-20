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
      <div className={classes.contentBox}>
        <div className={classes.contentContainer}>
          <div className={classes.headImage}>
            <img src={CompleteImage} alt="Congratulations" className={classes.imageBox} />
          </div>
          <div className={classes.title}>
            <p className={classes.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mollis donec gravida commodo
              vitae, id malesuada accumsan. Morbi in quisque ligula natoque faucibus. Volutpat orci,
              scelerisque sed a nulla. Tortor consequat.
            </p>
          </div>
          <div className={classes.infoContainer}>
            <div className={classes.infoBox}>
              <div className={classes.textContainer}>
                <p className={classes.titleText}>Clear Cache / Potential Risks, Links</p>
              </div>
              <hr className={classes.dividerLine} />
            </div>
            <p className={classes.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mollis donec gravida commodo
              vitae, id malesuada accumsan. Morbi in quisque ligula natoque faucibus. Volutpat orci,
              scelerisque sed a nulla. Tortor consequat.
            </p>
          </div>
          <div className={classes.buttonBox}>
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
