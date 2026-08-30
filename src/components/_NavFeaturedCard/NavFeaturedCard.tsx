import React, { useContext } from "react"

import { HelpModalTabs } from "src/constants"
import { HelpModalContext } from "src/context/HelpModalContext"
import classes from "./NavFeaturedCard.module.scss"

type Props = {}

const NavFeaturedCard: React.FC<Props> = ({ }) => {

  const { setTab, setIsOpen } = useContext(HelpModalContext)

  const handleMoreInfoButton = () => {
    setTab(HelpModalTabs.Warning)
    setIsOpen(true)
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.mainContentContainer}>
        <p className={classes.title}>
          Attention!
        </p>

        <p className={classes.supportingText}>
          Do not combine Seedhodler with other products, such as Trezor-generated shamir seeds.
          Please ensure you read this issue carefully before using this product.
        </p>
      </div>

      <button className={classes.actionButton} onClick={handleMoreInfoButton}>
        <p>More info</p>
      </button>
    </div>
  )
}

export default NavFeaturedCard
