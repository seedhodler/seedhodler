import React, { Dispatch, SetStateAction } from "react"

import { BadgeTitle } from "src/components/BadgeTitle"
import { SchemeNotice } from "src/components/SchemeNotice"
import { Select } from "src/components/Select"
import { Switch } from "src/components/Switch"
import { Tooltip } from "src/components/Tooltip"
import { BadgeColorsEnum, schemeOptions, wordCountOptions } from "src/constants/index"
import type { Scheme } from "src/core"

import classes from "./GenerateContent.module.scss"

type GenerateContentSettingsProps = {
  selectedLang: string
  setSelectedLang: Dispatch<SetStateAction<string>>
  selectedWordCount: string
  setSelectedWordCount: Dispatch<SetStateAction<string>>
  selectedScheme: Scheme
  setSelectedScheme: Dispatch<SetStateAction<Scheme>>
  isAdvanced: boolean
  setIsAdvanced: Dispatch<SetStateAction<boolean>>
  setEntropyValue: Dispatch<SetStateAction<string>>
}

export const GenerateContentSettings: React.FC<GenerateContentSettingsProps> = ({
  selectedLang,
  setSelectedLang,
  selectedWordCount,
  setSelectedWordCount,
  selectedScheme,
  setSelectedScheme,
  isAdvanced,
  setIsAdvanced,
  setEntropyValue,
}) => {
  const handleWordCountChange = (wordCountValue: string) => {
    setEntropyValue("")
    setSelectedWordCount(wordCountValue)
  }

  // The tooltip beside the selector explains what the scheme IS (education). The
  // safety warning lives in SchemeNotice below, inline and scheme-aware. Keeping
  // the two apart is deliberate: the tooltip is optional extra reading, the
  // warning must always be visible.
  const schemeNote =
    selectedScheme === "slip39"
      ? "SLIP-39 splits your seed into recovery shares with Shamir's Secret Sharing; any chosen threshold of the shares rebuilds it. The shares are SLIP-39 words."
      : "SSKR is Blockchain Commons' sharding standard. Shares are encoded as bytewords: four-letter words with a built-in checksum."

  return (
    <>
      <div className={classes.headerContainer} style={{ marginBottom: "3.6rem" }}>
        <BadgeTitle
          title="Seed Type"
          additionalInfo="BIP 39"
          color={BadgeColorsEnum.SuccessLight}
          style={{ marginBottom: 0 }}
        />
        <div className={classes.wordCountContainer}>
          <p>Word number count:</p>
          <Select
            defaultValue={selectedWordCount}
            onChange={handleWordCountChange}
            options={wordCountOptions}
          />
        </div>
      </div>
      <div className={classes.headerContainer} style={{ marginBottom: "1rem" }}>
        <div className={classes.wordCountContainer}>
          <div className={classes.labelWithInfo}>
            <p>Share scheme:</p>
            <Tooltip content={schemeNote} label="About this share scheme" />
          </div>
          <Select
            defaultValue={selectedScheme}
            onChange={value => setSelectedScheme(value as Scheme)}
            options={schemeOptions}
          />
        </div>
      </div>
      <SchemeNotice selectedScheme={selectedScheme} />
      <div className={classes.configContainer}>
        <div className={classes.configLabelContainer}>
          <p>
            Advanced Toolset - <span className={classes.entropyGeneration}>Entropy Generation</span>
          </p>
          <Tooltip
            content="Don't trust the randomness of a computer? You can enter your own entropy here."
            label="About the advanced entropy toolset"
          />
        </div>
        <Switch checked={isAdvanced} onChange={setIsAdvanced} />
      </div>
      <div className={classes.blockDivider} />
    </>
  )
}
