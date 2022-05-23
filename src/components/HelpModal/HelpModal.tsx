import React, { Dispatch, SetStateAction } from "react"

import { Modal } from "components/Modal"
import { Accordion } from "components/Accordion"
import { Button } from "components/Button"
import { BadgeColorsEnum } from "constants/"

import classes from "./HelpModal.module.scss"

type Props = {
  isActive: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
}

const HelpModal: React.FC<Props> = ({ isActive, setIsActive }) => {
  return (
    <Modal
      badgeColor={BadgeColorsEnum.Success}
      title="Help & getting started"
      isActive={isActive}
      setIsActive={setIsActive}
      style={{ height: "auto" }}
    >
      <div className={classes.container}>
        <div className={classes.divider}></div>
        <p style={{ marginBottom: "2.4rem" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tempor purus justo lacinia eu,
          maecenas elementum senectus mauris. Pellentesque vestibulum, tristique ultrices urna luctus
          eget arcu faucibus adipiscing. At euismod orci, a, cras et aliquet. Urna, integer nibh
          scelerisque eget ut pellentesque vestibulum, nisl quisque. __placeholder
        </p>
        <p style={{ marginBottom: "1.6rem" }}>
          Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet
          pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae
          malesuada fringilla. Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo
          consectetur convallis risus. __placeholder
        </p>
        <ul className={classes.list}>
          <li>
            Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id.Diam elit, orci,
            tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue felis elit erat
            nam nibh orci. __placeholder
          </li>
          <li>Non pellentesque congue eget consectetur turpis. __placeholder</li>
          <li>
            Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit eget
            ut tortor tellus. Sed vel, congue felis elit erat nam nibh orci. __placeholder
          </li>
        </ul>
        <Accordion label="About Entropy Generation __placeholder">
          Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet
          pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae
          malesuada fringilla. Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo
          consectetur convallis risus. __placeholder
        </Accordion>
        <Accordion label="About Entropy Generation __placeholder">
          Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet
          pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae
          malesuada fringilla. Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo
          consectetur convallis risus. __placeholder
        </Accordion>
        <div className={classes.buttonContainer}>
          <Button onClick={() => setIsActive(false)}>Done</Button>
        </div>
      </div>
    </Modal>
  )
}

export default HelpModal
