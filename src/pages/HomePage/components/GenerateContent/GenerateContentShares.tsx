import * as bip39 from "bip39"
import React, { Dispatch, SetStateAction, useContext, useState } from "react"

import { BadgeTitle } from "src/components/BadgeTitle"
import { Button } from "src/components/Button"
import { Calc } from "src/components/Calc"
import { InfoTitle } from "src/components/InfoTitle"
import { Input } from "src/components/Input"
import { BadgeColorsEnum, ButtonColorsEnum } from "src/constants/index"
import { GenerateContext } from "src/context/generateContext"
import { useInputRefs } from "src/hooks"

import { ExportSaveModal } from "../ExportSaveModal"
import { PrintFormsModal } from "../PrintFormsModal"
import { Shares } from "../Shares"
import classes from "./GenerateContent.module.scss"

type GenerateContentSharesProps = {
  selectedLang: string
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
  selectedLang,
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
  const { selectedScheme } = useContext(GenerateContext)
  const [isExportSaveModalActive, setIsExportSaveModalActive] = useState(false)
  const [isPrintModalActive, setIsPrintModalActive] = useState(false)
  const inputRefs = useInputRefs(+selectedWordCount)
  const isSomeEmptyWord = mnemonic.some(word => word.length === 0)

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
      <p className={classes.title}>BIP39 Master Seed</p>
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
            wordlist={bip39.wordlists[selectedLang]}
            isError={!isValidMnemonic}
            containerStyle={{
              width: "49%",
              marginBottom: "1.2rem",
              alignSelf: index >= +selectedWordCount / 2 ? "flex-end" : "flex-start",
            }}
          />
        ))}
      </div>

      {!isSomeEmptyWord ? (
        <>
          <BadgeTitle title="Split Seed into Shares" color={BadgeColorsEnum.SuccessLight} />
          <p className={classes.sharesInfo}>
            The generated Master Seed can now be split into up to 16 different Shares. These can then be
            combined to restore your Master Seed
          </p>
          <div className={classes.thresholdSharesContainer}>
            <div className={classes.calcContainer}>
              <InfoTitle
                title="Threshold"
                desc="How many of the Shares should be required the original Master Seed"
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
                desc="How many of your split shares to generate in total"
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
            />
          )}
          <div className={classes.actionRow}>
            <Button
              onClick={() => setIsPrintModalActive(true)}
              disabled={!Boolean(shares)}
              fullWidth
              color={ButtonColorsEnum.Success}
            >
              Print
            </Button>
            <Button
              onClick={() => setIsExportSaveModalActive(true)}
              disabled={!Boolean(shares) || selectedScheme === "sskr"}
              fullWidth
              color={ButtonColorsEnum.Neutral}
            >
              Verify
            </Button>
          </div>
          {shares && selectedScheme === "sskr" && (
            <p className={classes.verifyNote}>Verification is available for SLIP-39 shares for now.</p>
          )}
        </>
      ) : null
      // <div className={classes.whitespace} />
      }
      <PrintFormsModal
        isActive={isPrintModalActive}
        setIsActive={setIsPrintModalActive}
        selectedWordCount={+selectedWordCount}
        selectedScheme={selectedScheme}
        sharesNumber={sharesNumber}
      />
      <ExportSaveModal
        isExportSaveModalActive={isExportSaveModalActive}
        setIsExportSaveModalActive={setIsExportSaveModalActive}
        selectedWordCount={+selectedWordCount}
        shares={shares!}
        sharesNumber={sharesNumber}
      />
    </>
  )
}
