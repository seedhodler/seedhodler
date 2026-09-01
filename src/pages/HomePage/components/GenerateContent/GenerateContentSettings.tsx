import React, { Dispatch, SetStateAction } from "react"

import InfoGrayIcon from "src/assets/icons/InfoGray.svg"
import { BadgeTitle } from "src/components/BadgeTitle"
import { Select } from "src/components/Select"
import { Switch } from "src/components/Switch"
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
          <p>Share scheme:</p>
          <Select
            defaultValue={selectedScheme}
            onChange={value => setSelectedScheme(value as Scheme)}
            options={schemeOptions}
          />
        </div>
      </div>
      <div className={classes.schemeWarning}>
        {selectedScheme === "slip39"
          ? "SLIP-39 shares here encode your BIP-39 entropy, not a device seed. Never enter them into a Trezor or any hardware wallet — it opens a different, empty wallet."
          : "SSKR shares are bytewords (four-letter words). A hardware wallet does not accept them; restore them here or with any Blockchain Commons tool."}
      </div>
      <div className={classes.configContainer}>
        <div
          className={classes.configLabelContainer}
          title={"Don't trust the randsomness of a computer? You can enter your own entropy here."}
        >
          <p>
            Advanced Toolset - <span className={classes.entropyGeneration}>Entropy Generation</span>
          </p>
          <img src={InfoGrayIcon} alt="Info" style={{ marginLeft: "0.5rem" }} />
        </div>
        <Switch checked={isAdvanced} onChange={setIsAdvanced} />
      </div>
      <div className={classes.blockDivider} />
    </>
  )
}
