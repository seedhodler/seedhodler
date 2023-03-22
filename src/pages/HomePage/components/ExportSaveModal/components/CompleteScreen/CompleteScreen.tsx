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
              In order to remove any single point of failure it is advised to destroy the original master
              seed now. However, you may want to first double check that you have written down the seed
              shares correctly. You can do this by using the seedhodler tool to rejoin the shares and
              cross check that the regenerated master seed matches with the original one (which you are
              about to destroy)
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
              Store your seed shares in a physically safe and secure manner. Some best practices include
              using fireproof and waterproof storage and using separate locations. This could include
              storing them with different family members, trusted friends, or a safe deposit box and a
              home safe. It is also a good idea to not disclose to anyone else which entities are holding
              your seed shares.
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
