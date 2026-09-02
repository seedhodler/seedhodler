import * as bip39 from "bip39"
import React, { Dispatch, SetStateAction, useContext, useState } from "react"

import InfoRed from "src/assets/icons/InfoRed.svg"
import { BadgeTitle } from "src/components/BadgeTitle"
import { Button } from "src/components/Button"
import { Calc } from "src/components/Calc"
import { InfoTitle } from "src/components/InfoTitle"
import { Input } from "src/components/Input"
import { SchemeNotice } from "src/components/SchemeNotice"
import { Select } from "src/components/Select"
import { Tooltip } from "src/components/Tooltip"
import { BadgeColorsEnum, ButtonColorsEnum, schemeOptions } from "src/constants/index"
import { OnlineStatusContext } from "src/context/onlineStatusContext"
import type { Scheme } from "src/core"
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
  selectedScheme: Scheme
  setSelectedScheme: Dispatch<SetStateAction<Scheme>>
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
  selectedScheme,
  setSelectedScheme,
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
  // The tooltip beside the selector explains what the scheme IS (education); the
  // SchemeNotice below it carries the safety warning. Kept apart on purpose.
  const schemeNote =
    selectedScheme === "slip39"
      ? "SLIP-39 splits your seed into recovery shares with Shamir's Secret Sharing; any chosen threshold of the shares rebuilds it. The shares are SLIP-39 words."
      : "SSKR is Blockchain Commons' sharding standard. Shares are encoded as bytewords: four-letter words with a built-in checksum."

  const [isExportSaveModalActive, setIsExportSaveModalActive] = useState(false)
  const [isPrintModalActive, setIsPrintModalActive] = useState(false)
  const inputRefs = useInputRefs(+selectedWordCount)
  const isSomeEmptyWord = mnemonic.some(word => word.length === 0)

  // The seed and its shares are the secret. When they are on screen while the
  // machine is online, the calm status pill is not enough: escalate to a loud,
  // red warning right where the secret is. This is the danger moment the pill
  // deliberately stays quiet for.
  const isOnline = useContext(OnlineStatusContext)
  const secretOnScreen = !isSomeEmptyWord

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
      {secretOnScreen && isOnline && (
        <div className={classes.onlineSecretWarning} role="alert">
          <img src={InfoRed} alt="" aria-hidden="true" />
          <p>
            <b>You are online while your master seed is on screen.</b> Disconnect from the internet
            before you write down, print, or split it.
          </p>
        </div>
      )}
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
              disabled={!Boolean(shares)}
              fullWidth
              color={ButtonColorsEnum.Neutral}
            >
              Verify
            </Button>
          </div>
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
        selectedScheme={selectedScheme}
        shares={shares!}
        sharesNumber={sharesNumber}
      />
    </>
  )
}
