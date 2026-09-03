import React, { Dispatch, SetStateAction } from "react"

import { BadgeTitle } from "src/components/BadgeTitle"
import { Select } from "src/components/Select"
import { Switch } from "src/components/Switch"
import { Tooltip } from "src/components/Tooltip"
import { BadgeColorsEnum, wordCountOptions } from "src/constants/index"

import classes from "./GenerateContent.module.scss"

type GenerateContentSettingsProps = {
  selectedLang: string
  setSelectedLang: Dispatch<SetStateAction<string>>
  selectedWordCount: string
  setSelectedWordCount: Dispatch<SetStateAction<string>>
  isAdvanced: boolean
  setIsAdvanced: Dispatch<SetStateAction<boolean>>
  setEntropyValue: Dispatch<SetStateAction<string>>
}

export const GenerateContentSettings: React.FC<GenerateContentSettingsProps> = ({
  selectedLang,
  setSelectedLang,
  selectedWordCount,
  setSelectedWordCount,
  isAdvanced,
  setIsAdvanced,
  setEntropyValue,
}) => {
  const handleWordCountChange = (wordCountValue: string) => {
    setEntropyValue("")
    setSelectedWordCount(wordCountValue)
  }

  return (
    <>
      <div className={classes.headerContainer} style={{ marginBottom: "3.6rem" }}>
        <BadgeTitle
          title="Generate Master Seed"
          color={BadgeColorsEnum.Main}
          headingLevel={2}
          style={{ marginBottom: 0 }}
        />
        <div className={classes.wordCountContainer}>
          <p>Word count</p>
          <Select
            defaultValue={selectedWordCount}
            onChange={handleWordCountChange}
            options={wordCountOptions}
          />
        </div>
      </div>
      <div className={classes.configContainer}>
        <div className={classes.configLabelContainer}>
          <p>Entropy Generation</p>
          <Tooltip
            content="Don't trust the randomness of a computer? You can enter your own entropy here."
            label="About the advanced entropy toolset"
          />
        </div>
        <Switch checked={isAdvanced} onChange={setIsAdvanced} />
      </div>
      {/* The divider that closes this section is rendered by the parent, after the
          advanced entropy block when it is expanded (so it sits below the field,
          not below the heading). */}
    </>
  )
}
