import React, { Dispatch, SetStateAction } from "react"

import CongratsIcon from "assets/icons/Congrats.svg"
import { Button } from "components/Button"
import { Accordion } from "components/Accordion"

import classes from "../../ExportSaveModal.module.scss"

type Props = {
  setIsExportSaveModalActive: Dispatch<SetStateAction<boolean>>
}

const SuccessContent: React.FC<Props> = ({ setIsExportSaveModalActive }) => {
  return (
    <div className={classes.modalContentContainer}>
      <div style={{ width: "100%" }}>
        <p className={classes.description}>
          You have now sucessfully created your seedhodler shares. This is an important step in securing
          your cryptocurrency assets.
        </p>
        <img
          src={CongratsIcon}
          alt="Congratulations"
          style={{ height: "200px", display: "block", margin: "0 auto 1.2rem" }}
        />
        <Accordion label="Destroy your original master seed" defaultIsActive>
          In order to remove any single point of failure it is advised to destroy the original master
          seed now. However, you may want to first double check that you have written down the seed
          shares correctly. You can do this by using the seedhodler tool to rejoin the shares and cross
          check that the regenerated master seed matches with the original one (which you are about to
          destroy)
        </Accordion>
        <Accordion label="Distribute your seed shares" defaultIsActive>
          Store your seed shares in a physically safe and secure manner. Some best practices include
          using fireproof and waterproof storage and using separate locations. This could include storing
          them with different family members, trusted friends, or a safe deposit box and a home safe. It
          is also a good idea to not disclose to anyone else which entities are holding your seed shares.
        </Accordion>
      </div>
      <Button onClick={() => setIsExportSaveModalActive(false)}>Thank you for using Seedhodler</Button>
    </div>
  )
}

export default SuccessContent
