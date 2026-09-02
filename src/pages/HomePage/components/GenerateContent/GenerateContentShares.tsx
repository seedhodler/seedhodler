import * as bip39 from "bip39"
import React, { Dispatch, SetStateAction, useContext, useState } from "react"

import InfoRed from "src/assets/icons/InfoRed.svg"
import { BadgeTitle } from "src/components/BadgeTitle"
import { Button } from "src/components/Button"
import { Calc } from "src/components/Calc"
import { InfoTitle } from "src/components/InfoTitle"
import { Input } from "src/components/Input"
import { Modal } from "src/components/Modal"
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

  // Changing the threshold or the share count re-splits the seed into a brand new
  // set (the effect in generateContext runs on those). Once a set exists, sheets
  // may already be written or in a safe, so that must not happen silently. Hold
  // the change behind a confirmation: guard() applies it at once while no set
  // exists, and otherwise parks it until the user confirms in the dialog.
  const [pendingChange, setPendingChange] = useState<null | (() => void)>(null)
  const guard = (apply: () => void) => {
    if (shares) setPendingChange(() => apply)
    else apply()
  }

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
            <b>A seed shown on an online computer is not safe.</b> Disconnecting now is too late: the
            machine may already have leaked it, or leak it later. For real funds, generate and split
            on a machine that stays offline the whole time, such as the Seedhodler live ISO.
          </p>
        </div>
      )}
      <h2 className={classes.title}>BIP39 Master Seed</h2>
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
          <BadgeTitle title="Split Seed into Shares" color={BadgeColorsEnum.SuccessLight} headingLevel={2} />
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
                itemLabel="threshold"
                plusDisabled={thresholdNumber >= sharesNumber}
                minusDisabled={thresholdNumber <= 1}
                onPlus={() => guard(() => setThresholdNumber(prev => ++prev))}
                onMinus={() =>
                  guard(() => {
                    // only 1-of-1 member sharing allowed when threshold is 1
                    if (thresholdNumber === 2) {
                      setSharesNumber(1)
                    }
                    setThresholdNumber(prev => (prev <= 1 ? prev : --prev))
                  })
                }
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
                itemLabel="number of shares"
                plusDisabled={sharesNumber >= 16}
                minusDisabled={sharesNumber <= 1 || sharesNumber <= thresholdNumber}
                onPlus={() =>
                  guard(() => {
                    // only 1-of-1 member sharing allowed when threshold is 1
                    if (sharesNumber === 1) {
                      setThresholdNumber(2)
                    }
                    setSharesNumber(prev => (prev >= 16 ? prev : ++prev))
                  })
                }
                onMinus={() => guard(() => setSharesNumber(prev => (prev <= 1 ? prev : --prev)))}
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
      <Modal
        title="Create a new set?"
        isActive={pendingChange !== null}
        setIsActive={() => setPendingChange(null)}
        badgeColor={BadgeColorsEnum.ErrorLight}
        style={{ height: "auto" }}
      >
        <div className={classes.confirmBody}>
          <p className={classes.confirmText}>
            This rebuilds the set from scratch. The new shares will not combine with any you have
            already written down or printed, so continue only if you have not handed out any sheets
            yet.
          </p>
          <div className={classes.confirmActions}>
            <Button color={ButtonColorsEnum.Neutral} onClick={() => setPendingChange(null)}>
              Keep current set
            </Button>
            <Button
              color={ButtonColorsEnum.ErrorLightish}
              onClick={() => {
                pendingChange?.()
                setPendingChange(null)
              }}
            >
              Create a new set
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
