import * as bip39 from "bip39"
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"

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
import type { FormKey } from "src/helpers"
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
  // When set, the print dialog opens with exactly these forms pre-selected. The
  // seed print icon uses it to pre-select just the matching seed form; the main
  // Print button leaves it undefined and gets the full matching set.
  const [printPreselect, setPrintPreselect] = useState<FormKey[] | undefined>(undefined)
  const seedFormKey: FormKey = selectedWordCount === "12" ? "seed12" : "seed24"
  const openPrint = (preselect?: FormKey[]) => {
    setPrintPreselect(preselect)
    setIsPrintModalActive(true)
  }
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

  // The seed stays on screen through the whole share flow; a screenshot or a
  // glance catches it. Offer a blur toggle (audit 06), and blur it by default
  // once a share set exists, since from there the seed has been written down.
  const [seedHidden, setSeedHidden] = useState(false)
  useEffect(() => {
    if (shares) setSeedHidden(true)
  }, [shares])

  // Print is the filled button and Verify only outlined, so Verify reads as
  // optional (audit 09). Once printing has happened, flip the emphasis to Verify.
  const [hasPrinted, setHasPrinted] = useState(false)

  // The seed and its shares are the secret. When they are on screen while the
  // machine is online, the calm status pill is not enough: escalate to a loud,
  // red warning right where the secret is. This is the danger moment the pill
  // deliberately stays quiet for.
  const isOnline = useContext(OnlineStatusContext)
  const secretOnScreen = !isSomeEmptyWord

  // The app is one long page; each new step appears below the fold and the view
  // stays put, so people get stuck (audit 04). After the seed appears, scroll to
  // the split controls; after the split, scroll to the resulting shares.
  const splitAnchorRef = useRef<HTMLDivElement>(null)
  const sharesAnchorRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (secretOnScreen) splitAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [secretOnScreen])
  useEffect(() => {
    if (shares) sharesAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [shares])

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
      <div className={classes.seedCard}>
      <div className={classes.seedHeaderRow}>
        <h2 className={classes.title} style={{ marginBottom: 0 }}>{selectedWordCount} words</h2>
        {!isSomeEmptyWord && (
          <div className={classes.seedActions}>
            <button
              type="button"
              className={classes.seedIconBtn}
              onClick={() => setSeedHidden(hidden => !hidden)}
              aria-label={seedHidden ? "Reveal seed" : "Hide seed"}
              title={seedHidden ? "Reveal seed" : "Hide seed"}
            >
              {seedHidden ? (
                // Open eye: click to reveal.
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                // Crossed-out eye: click to hide.
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className={classes.seedIconBtn}
              onClick={() => openPrint([seedFormKey])}
              aria-label={`Print the blank ${selectedWordCount}-word seed form`}
              title={`Print the blank ${selectedWordCount}-word seed form`}
            >
              {/* Printer: opens the print dialog with the matching seed form pre-selected. */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className={classes.blockDivider} style={{ marginBottom: "2.4rem" }} />
      <div className={classes.seedWrap}>
        <div
          className={`${classes.seedPhraseContainer} ${seedHidden ? classes.seedBlurred : ""}`}
          style={{ height: selectedWordCount === "12" ? "360px" : "720px" }}
        >
          {mnemonic.map((word, index) => (
          <Input
            key={index}
            ref={inputRefs[index]}
            onEnter={onEnter}
            onClick={onClick}
            count={index + 1}
            total={+selectedWordCount}
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
        {seedHidden && (
          <button
            type="button"
            className={classes.seedReveal}
            onClick={() => setSeedHidden(false)}
          >
            Reveal seed
          </button>
        )}
      </div>
      </div>

      {!isSomeEmptyWord ? (
        <>
          <div ref={splitAnchorRef} className={classes.scrollAnchor} />
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
                value={selectedScheme}
                onChange={value => guard(() => setSelectedScheme(value as Scheme))}
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
          <div ref={sharesAnchorRef} className={classes.scrollAnchor} />
          {shares && (
            <Shares
              shares={shares}
              activeShareItemId={activeShareItemId}
              setActiveShareItemId={setActiveShareItemId}
            />
          )}
          <div className={classes.actionRow}>
            <Button
              onClick={() => openPrint()}
              disabled={!Boolean(shares)}
              fullWidth
              color={hasPrinted ? ButtonColorsEnum.Neutral : ButtonColorsEnum.Success}
            >
              Print
            </Button>
            <Button
              onClick={() => setIsExportSaveModalActive(true)}
              disabled={!Boolean(shares)}
              fullWidth
              color={hasPrinted ? ButtonColorsEnum.Success : ButtonColorsEnum.Neutral}
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
        onPrinted={() => setHasPrinted(true)}
        initialSelection={printPreselect}
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
        style={{ height: "auto", maxWidth: "680px" }}
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
