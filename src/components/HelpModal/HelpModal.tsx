import React, { useState, Dispatch, SetStateAction } from "react"

import { Modal } from "components/Modal"
import { Button } from "components/Button"
import { BadgeColorsEnum } from "constants/"

import classes from "./HelpModal.module.scss"

import {
  TAB_TITLES,
  GENERATION,
  INTRODUCTION,
  RECONSTRUCTING,
  TIPS_AND_BEST_PRACTICES,
  ABOUT,
  LEGAL,
} from "./constants"
import TabContent from "./TabContent"

type Props = {
  isActive: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
}

const HelpModal: React.FC<Props> = ({ isActive, setIsActive }) => {
  const [activeTab, setActiveTab] = useState(1)

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

        <div className={classes.horizontalTabs}>
          {TAB_TITLES.map(({ title, index }) => (
            <div
              className={activeTab === index ? `${classes.tab} ${classes.activeTab}` : classes.tab}
              onClick={() => setActiveTab(index)}
            >
              {title}
            </div>
          ))}
        </div>

        <div className={classes.contentBlock}>
          <TabContent title={INTRODUCTION.title} isActive={activeTab === 1}>
            {INTRODUCTION.toolDescription}{" "}
            <a
              href="https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              {INTRODUCTION.link}
            </a>{" "}
            {INTRODUCTION.masterSeedDescription}
            <div className={classes.margin} />
            {INTRODUCTION.usageDescription}
          </TabContent>

          <TabContent title={GENERATION.title} isActive={activeTab === 2}>
            <ul className={classes.list}>
              <li>{GENERATION.firstPrgrph}</li>
              <li>{GENERATION.secondPrgrph}</li>
              <li>{GENERATION.thirdPrgrph}</li>
              <li>{GENERATION.fourthPrgrph}</li>
              <li>{GENERATION.fifthPrgrph}</li>
              <li>{GENERATION.sixthPrgrph}</li>
            </ul>
          </TabContent>

          <TabContent title={RECONSTRUCTING.title} isActive={activeTab === 3}>
            <ul className={classes.list}>
              <li>{RECONSTRUCTING.firstPrgrph}</li>
              <li>{RECONSTRUCTING.secondPrgrph}</li>
              <li>{RECONSTRUCTING.thirdPrgrph}</li>
            </ul>
          </TabContent>

          <TabContent title={TIPS_AND_BEST_PRACTICES.title} isActive={activeTab === 4}>
            <ul className={classes.list}>
              <li>{TIPS_AND_BEST_PRACTICES.firstPrgrph}</li>
              <li>{TIPS_AND_BEST_PRACTICES.secondPrgrph}</li>
              <li>{TIPS_AND_BEST_PRACTICES.thirdPrgrph}</li>
              <li>{TIPS_AND_BEST_PRACTICES.fourthPrgrph}</li>
            </ul>
          </TabContent>

          <TabContent title={ABOUT.title} isActive={activeTab === 5}>
            {ABOUT.desc}
          </TabContent>

          <TabContent title={LEGAL.title} isActive={activeTab === 6}>
            {LEGAL.desc}
          </TabContent>
        </div>

        <div className={classes.buttonContainer}>
          <Button onClick={() => setIsActive(false)}>Done</Button>
        </div>
      </div>
    </Modal>
  )
}

export default HelpModal
