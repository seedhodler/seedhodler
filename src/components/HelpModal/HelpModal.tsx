import React, { useState, Dispatch, SetStateAction } from "react"

import TabContent from "./components/TabContent"

import { Modal } from "components/Modal"
import { Button } from "components/Button"
import { BadgeColorsEnum } from "constants/"
import {
  TAB_TITLES,
  GENERATING,
  INTRODUCTION,
  RECONSTRUCTING,
  TIPS_AND_BEST_PRACTICES,
  ABOUT,
  LEGAL,
  Tabs,
} from "./constants"

import classes from "./HelpModal.module.scss"

type Props = {
  isActive: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
}

const HelpModal: React.FC<Props> = ({ isActive, setIsActive }) => {
  const [activeTab, setActiveTab] = useState(Tabs.Introduction)

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
              key={index}
              className={activeTab === index ? `${classes.tab} ${classes.activeTab}` : classes.tab}
              onClick={() => setActiveTab(index)}
            >
              {title}
            </div>
          ))}
        </div>
        <div className={classes.contentBlock}>
          <TabContent title={INTRODUCTION.title} isActive={activeTab === Tabs.Introduction}>
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

          <TabContent title={GENERATING.title} isActive={activeTab === Tabs.Generating}>
            <ul className={classes.list}>
              <li>{GENERATING.firstPrgrph}</li>
              <li>{GENERATING.secondPrgrph}</li>
              <li>{GENERATING.thirdPrgrph}</li>
              <li>{GENERATING.fourthPrgrph}</li>
              <li>{GENERATING.fifthPrgrph}</li>
              <li>{GENERATING.sixthPrgrph}</li>
            </ul>
          </TabContent>

          <TabContent title={RECONSTRUCTING.title} isActive={activeTab === Tabs.Reconstructing}>
            <ul className={classes.list}>
              <li>{RECONSTRUCTING.firstPrgrph}</li>
              <li>{RECONSTRUCTING.secondPrgrph}</li>
              <li>{RECONSTRUCTING.thirdPrgrph}</li>
            </ul>
          </TabContent>

          <TabContent
            title={TIPS_AND_BEST_PRACTICES.title}
            isActive={activeTab === Tabs.Tips_and_best_practices}
          >
            <ul className={classes.list}>
              <li>{TIPS_AND_BEST_PRACTICES.firstPrgrph}</li>
              <li>{TIPS_AND_BEST_PRACTICES.secondPrgrph}</li>
              <li>{TIPS_AND_BEST_PRACTICES.thirdPrgrph}</li>
              <li>{TIPS_AND_BEST_PRACTICES.fourthPrgrph}</li>
            </ul>
          </TabContent>

          <TabContent title={ABOUT.title} isActive={activeTab === Tabs.About}>
            {ABOUT.desc}
          </TabContent>

          <TabContent title={LEGAL.title} isActive={activeTab === Tabs.Legal}>
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
