import React, { Dispatch, SetStateAction } from "react"

import { BadgeTitle } from "components/BadgeTitle"
import { Select } from "components/Select"
import { Switch } from "components/Switch"
import { InfoTitle } from "components/InfoTitle"
import { BadgeColorsEnum, langOptions, wordCountOptions } from "constants/index"
import InfoGrayIcon from "assets/icons/InfoGray.svg"

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
      <BadgeTitle title="Phrase" additionalInfo="BIP 39" color={BadgeColorsEnum.SuccessLight} />
      <div className={classes.configContainer}>
        <div>
          <InfoTitle title="Language" desc="Language __placeholder" />
          <Select
            defaultValue={selectedLang}
            onChange={(selectedLangValue: string) => setSelectedLang(selectedLangValue)}
            options={langOptions}
          />
        </div>
        <div>
          <InfoTitle title="Word Count" desc="Word Count __placeholder" />
          <Select
            defaultValue={selectedWordCount}
            onChange={handleWordCountChange}
            options={wordCountOptions}
          />
        </div>
      </div>
      <div className={classes.configContainer}>
        <div
          className={classes.configLabelContainer}
          title={`None of these advanced functions are necessary for successful generating and
splitting your seed phrase. when used incorrectly these advanced functions may lead to
generating of unsafe seed phrases that can be (and will be) guessed easily. Be careful!`}
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
