import React, { Dispatch, SetStateAction } from "react"

import classes from "./NavFeaturedCard.module.scss"

import closeIcon from "assets/icons/CloseIcon.svg"

type Props = {
  setIsActive: Dispatch<SetStateAction<boolean>>
}

const NavFeaturedCard: React.FC<Props> = ({ setIsActive }) => {
  const handleHelpButton = () => {}
  const handleMoreInfoButton = () => {}

  return (
    <div className={classes.mainContainer}>
      <div className={classes.mainContentContainer}>
        <div className={classes.titleWrap}>
          <p className={classes.title}>Attention!</p>

          <div className={classes.buttonClose}>
            <div className={classes.xClose}>
              <img
                src={closeIcon}
                className={classes.closeIcon}
                alt="closeIcon"
                onClick={() => setIsActive(false)}
              />
            </div>
          </div>
        </div>

        <p className={classes.supportingText}>
          Seedhodler nicht mit anderen Produkten zu mischen, zb Trezor Generated Seeds. Please make sure
          to read through this issue before using this product.
        </p>
      </div>
      <div className={classes.helpProgressBar}>
        <div className={classes.progressBar}>
          <div className={classes.progressBackground}>
            <div className={classes.progress}></div>
          </div>
        </div>
      </div>

      <div className={classes.actions}>
        <button className={classes.buttonContainer} onClick={handleHelpButton}>
          <p className={classes.helpButton}>Help</p>
        </button>

        <button className={classes.buttonContainer} onClick={handleMoreInfoButton}>
          <p className={classes.moreInfoButton}>More info</p>
        </button>
      </div>
    </div>
  )
}

export default NavFeaturedCard
