import React, { Dispatch, SetStateAction } from "react"

import { HelpModalTabs } from "constants/"
import classes from "./NavFeaturedCard.module.scss"

type Props = {
  setIsActive: Dispatch<SetStateAction<boolean>>
  setIsHelpModalActive: Dispatch<SetStateAction<boolean>>
  setHelpModalStartTab: Dispatch<SetStateAction<number | null>>
}

const NavFeaturedCard: React.FC<Props> = ({
  setIsActive,
  setIsHelpModalActive,
  setHelpModalStartTab,
}) => {
  const handleMoreInfoButton = () => {
    setHelpModalStartTab(HelpModalTabs.Warning)
    setIsHelpModalActive(true)
    //uncomment if you need to close the window after opening HelpModal
    // setIsActive(false)
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.mainContentContainer}>
        <div className={classes.titleWrap}>
          <p className={classes.title}>Attention!</p>
        </div>

        <p className={classes.supportingText}>
          Seedhodler nicht mit anderen Produkten zu mischen, zb Trezor Generated Seeds. Please make sure
          to read through this issue before using this product.
        </p>
      </div>

      <div className={classes.actions}>
        <button className={classes.buttonContainer} onClick={handleMoreInfoButton}>
          <p className={classes.moreInfoButton}>More info</p>
        </button>
      </div>
    </div>
  )
}

export default NavFeaturedCard
