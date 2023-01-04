import React, { Dispatch, SetStateAction, useState } from "react"

import { Calc } from "components/Calc"
import { BadgeTitle } from "components/BadgeTitle"
import { InfoTitle } from "components/InfoTitle"
import { Button } from "components/Button"
import { Input } from "components/Input"
import { BadgeColorsEnum, ButtonColorsEnum } from "constants/index"
import { useInputRefs } from "hooks"

import { Shares } from "../Shares"
import { ExportSaveModal } from "../ExportSaveModal"
import classes from "./GenerateContent.module.scss"

type GenerateContentSharesProps = {
  mnemonic: string[]
  shares: null | string[]
  selectedWordCount: string
  activeShareItemId: number
  setMnemonic: Dispatch<SetStateAction<string[]>>
  setActiveShareItemId: Dispatch<SetStateAction<number>>
  thresholdNumber: number
  setThresholdNumber: Dispatch<SetStateAction<number>>
  sharesNumber: number
  setSharesNumber: Dispatch<SetStateAction<number>>
  handleGenerateShares: () => void
  isValidMnemonic: boolean
}

export const GenerateContentShares: React.FC<GenerateContentSharesProps> = ({
  mnemonic,
  shares,
  selectedWordCount,
  activeShareItemId,
  setMnemonic,
  setActiveShareItemId,
  thresholdNumber,
  setThresholdNumber,
  sharesNumber,
  setSharesNumber,
  handleGenerateShares,
  isValidMnemonic,
}) => {
  const [isExportSaveModalActive, setIsExportSaveModalActive] = useState(false)
  const inputRefs = useInputRefs(+selectedWordCount)

  const onEnter = (index: number) => {
    if (index < +selectedWordCount - 1) {
      inputRefs[index + 1].current.focus()
    }
  }

  const onClick = (index: number) => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      inputRefs[index].current.scrollIntoView()
    }
  }

  return (
    <>
      <p className={classes.title}>BIP39 Seed Phrase</p>
      <div
        className={classes.seedPhraseContainer}
        style={{ height: selectedWordCount === "12" ? "360px" : "720px" }}
      >
        {mnemonic.map((word, index) => (
          <Input
            key={index}
            ref={inputRefs[index]}
            onEnter={onEnter}
            onClick={onClick}
            count={index + 1}
            index={index}
            value={word}
            onChange={setMnemonic}
            isError={!isValidMnemonic}
            containerStyle={{
              width: "49%",
              marginBottom: "1.2rem",
              alignSelf: index >= +selectedWordCount / 2 ? "flex-end" : "flex-start",
            }}
          />
        ))}
      </div>
      {mnemonic.every(word => word.length !== 0) && (
        <>
          <BadgeTitle title="Split Phrase into shares" color={BadgeColorsEnum.SuccessLight} />
          <p className={classes.sharesInfo}>
            The generated Phrase can now be split into up to 6 different shares. These can then be
            combined to restore your Phrase
          </p>
          <div className={classes.thresholdSharesContainer}>
            <div className={classes.calcContainer}>
              <InfoTitle
                title="Threshold"
                desc="How many shares are needed to regenerate the original master seed"
                className={classes.calcTitle}
              />
              <Calc
                value={thresholdNumber}
                plusDisabled={thresholdNumber >= sharesNumber}
                minusDisabled={thresholdNumber <= 1}
                onPlus={() => setThresholdNumber(prev => ++prev)}
                onMinus={() => {
                  // only 1-of-1 member sharing allowed when threshold is 1
                  if (thresholdNumber === 2) {
                    setSharesNumber(1)
                  }
                  setThresholdNumber(prev => (prev <= 1 ? prev : --prev))
                }}
              />
            </div>
            <div className={classes.calcContainer}>
              <InfoTitle
                title="Shares"
                desc="How many of your shares to generate in total"
                className={classes.calcTitle}
              />
              <Calc
                value={sharesNumber}
                plusDisabled={sharesNumber >= 16}
                minusDisabled={sharesNumber <= 1 || sharesNumber <= thresholdNumber}
                onPlus={() => {
                  // only 1-of-1 member sharing allowed when threshold is 1
                  if (sharesNumber === 1) {
                    setThresholdNumber(2)
                  }
                  setSharesNumber(prev => (prev >= 16 ? prev : ++prev))
                }}
                onMinus={() => setSharesNumber(prev => (prev <= 1 ? prev : --prev))}
              />
            </div>
          </div>
          {!shares && (
            <Button onClick={handleGenerateShares} fullWidth style={{ marginBottom: "3.6rem" }}>
              Split
            </Button>
          )}
          {shares && (
            <Shares
              shares={shares}
              activeShareItemId={activeShareItemId}
              setActiveShareItemId={setActiveShareItemId}
              selectedWordCount={+selectedWordCount}
            />
          )}
          <Button
            onClick={() => setIsExportSaveModalActive(true)}
            disabled={!Boolean(shares)}
            fullWidth
            color={ButtonColorsEnum.Success}
          >
            Export / Save Shares
          </Button>
        </>
      )}
      <ExportSaveModal
        isExportSaveModalActive={isExportSaveModalActive}
        setIsExportSaveModalActive={setIsExportSaveModalActive}
        selectedWordCount={+selectedWordCount}
        mnemonic={mnemonic}
        shares={shares!}
        sharesNumber={sharesNumber}
      />
    </>
  )
}
