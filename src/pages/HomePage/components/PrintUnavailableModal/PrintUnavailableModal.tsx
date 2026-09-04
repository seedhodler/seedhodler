import React, { Dispatch, SetStateAction } from "react"

import { Modal } from "src/components/Modal"
import { BadgeColorsEnum } from "src/constants/index"

type Props = {
  isActive: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
}

// Shown in the offline build (Seedhodler OS) when a print control is clicked.
// This version does not print, so the print buttons stay visible for orientation
// but point to the website. The blank forms carry no secret, so printing them on
// a normal printer is safe; only the seed and shares must stay offline.
const PrintUnavailableModal: React.FC<Props> = ({ isActive, setIsActive }) => (
  <Modal
    title="Printing is on the website"
    isActive={isActive}
    setIsActive={setIsActive}
    badgeColor={BadgeColorsEnum.Main}
    style={{ height: "auto" }}
  >
    <div style={{ padding: "0.4rem 0 1.2rem", fontSize: "15px", lineHeight: 1.6, color: "#3a3a3a" }}>
      <p style={{ margin: 0 }}>
        This offline version does not print. The blank backup forms hold no secret,
        so print them from{" "}
        <a
          href="https://seedhodler.io"
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: "#4526a6", fontWeight: 600 }}
        >
          seedhodler.io
        </a>{" "}
        on any normal printer, then write your shares onto them by hand here.
      </p>
    </div>
  </Modal>
)

export default PrintUnavailableModal
