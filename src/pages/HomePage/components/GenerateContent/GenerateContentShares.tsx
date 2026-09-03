import * as bip39 from "bip39"
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"

import CheckmarkFilledLight from "src/assets/icons/CheckmarkFilledLight.svg"
import InfoRed from "src/assets/icons/InfoRed.svg"
import PrintIcon from "src/assets/icons/Print.svg"
import { BadgeTitle } from "src/components/BadgeTitle"
import { Button } from "src/components/Button"
import { InfoTitle } from "src/components/InfoTitle"
import { Input } from "src/components/Input"
import { Modal } from "src/components/Modal"
import { SchemeNotice } from "src/components/SchemeNotice"
import { CopyButton } from "src/components/CopyButton"
import { SeedCard } from "src/components/SeedCard"
import { Select } from "src/components/Select"
import { BadgeColorsEnum, ButtonColorsEnum, schemeOptions } from "src/constants/index"
import { GenerateContext } from "src/context/generateContext"
import { OnlineStatusContext } from "src/context/onlineStatusContext"
import type { Scheme } from "src/core"
import { matchingFormKeys } from "src/helpers"
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
      : "SSKR is Blockchain Commons' sharding standard. Its shares are four-letter words with a built-in checksum."

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

  // Threshold and share count are picked from dropdowns rather than +/- steppers:
  // each step used to fire the confirmation once a set exists, so jumping from
  // 5 to 15 meant confirming ten times. A dropdown lands the target value in a
  // single guarded change, so the dialog appears at most once.
  const sharesOptions = Array.from({ length: 16 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }))
  // Threshold cannot exceed the share count, and a threshold of 1 only exists as
  // 1-of-1 (a single share). So offer 2..shares normally, or just 1 when the
  // share count itself is 1; 1-of-1 is reached by picking a share count of 1.
  const thresholdOptions =
    sharesNumber === 1
      ? [{ label: "1", value: "1" }]
      : Array.from({ length: sharesNumber - 1 }, (_, i) => ({
          label: String(i + 2),
          value: String(i + 2),
        }))
  const handleThresholdChange = (val: string) => guard(() => setThresholdNumber(+val))
  const handleSharesChange = (val: string) =>
    guard(() => {
      const s = +val
      setSharesNumber(s)
      if (s === 1) {
        // 1-of-1 member sharing: threshold must follow to 1.
        setThresholdNumber(1)
      } else {
        // Lift a 1-of-1 threshold back to 2, and clamp it down if it now exceeds
        // the reduced share count.
        setThresholdNumber(prev => {
          const t = prev < 2 ? 2 : prev
          return t > s ? s : t
        })
      }
    })

  // The seed stays on screen through the whole share flow; a screenshot or a
  // glance catches it. Offer a blur toggle (audit 06), and blur it by default
  // once a share set exists, since from there the seed has been written down.
  const [seedHidden, setSeedHidden] = useState(false)
  useEffect(() => {
    if (shares) setSeedHidden(true)
  }, [shares])

  // The seed and its shares are the secret. When they are on screen while the
  // machine is online, the calm status pill is not enough: escalate to a loud,
  // red warning right where the secret is. This is the danger moment the pill
  // deliberately stays quiet for.
  const isOnline = useContext(OnlineStatusContext)
  // Checklist progress flags (set here when the user prints or verifies).
  const { setHasPrintedShares, setHasVerified, setHasPrintedInserts } = useContext(GenerateContext)
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
      <SeedCard
        title="Master Seed"
        wordCount={selectedWordCount}
        actions={
          !isSomeEmptyWord && (
            <>
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
              <CopyButton
                getText={() => mnemonic.join(" ")}
                className={classes.seedIconBtn}
                title="Copy seed words"
              />
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
            </>
          )
        }
      >
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
      </SeedCard>

      {!isSomeEmptyWord ? (
        <>
          {/* Splitting is a new section, not a continuation of the seed card:
              a full-width rule sets it apart. */}
          <div className={classes.sectionDivider} />
          <div ref={splitAnchorRef} className={classes.scrollAnchor} />
          <BadgeTitle title="Split Master Seed" color={BadgeColorsEnum.Main} headingLevel={2} />
          <p className={classes.sharesInfo}>
            Break your Master Seed into up to 16 shares. Your chosen threshold brings it back, while
            anything less reveals nothing.
          </p>
          {/* One config row: scheme, threshold and share count read as a single
              group that defines the split, with the scheme warning below it. */}
          <div className={classes.configRow}>
            <div className={classes.configField}>
              <InfoTitle title="Share scheme" desc={schemeNote} className={classes.calcTitle} />
              <Select
                variant="compact"
                compactWidth={132}
                value={selectedScheme}
                defaultValue={selectedScheme}
                options={schemeOptions}
                onChange={value => guard(() => setSelectedScheme(value as Scheme))}
              />
            </div>
            <div className={classes.configField}>
              <InfoTitle
                title="Threshold"
                desc="How many of the Shares are required to reconstruct the original Master Seed"
                className={classes.calcTitle}
              />
              <Select
                variant="compact"
                value={String(thresholdNumber)}
                defaultValue={String(thresholdNumber)}
                options={thresholdOptions}
                onChange={handleThresholdChange}
              />
            </div>
            <div className={classes.configField}>
              <InfoTitle
                title="Shares"
                desc="How many of your split shares to generate in total"
                className={classes.calcTitle}
              />
              <Select
                variant="compact"
                value={String(sharesNumber)}
                defaultValue={String(sharesNumber)}
                options={sharesOptions}
                onChange={handleSharesChange}
              />
            </div>
          </div>
          <SchemeNotice selectedScheme={selectedScheme} />
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
              scheme={selectedScheme}
              onPrint={() => {
                // Print only the share form matching this scheme and length
                // (matchingFormKeys returns [seed, share]).
                const shareForm = matchingFormKeys(+selectedWordCount, selectedScheme)[1]
                if (shareForm) openPrint([shareForm])
              }}
            />
          )}
          <div className={classes.actionRow}>
            {/* Print and Verify are a matched pair of post-split actions: same
                colour, each with its own icon, so neither reads as more optional
                than the other. */}
            <Button
              onClick={() => openPrint()}
              disabled={!Boolean(shares)}
              fullWidth
              iconLeft={PrintIcon}
              color={ButtonColorsEnum.Success}
            >
              Print
            </Button>
            <Button
              onClick={() => setIsExportSaveModalActive(true)}
              disabled={!Boolean(shares)}
              fullWidth
              iconLeft={CheckmarkFilledLight}
              color={ButtonColorsEnum.Success}
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
        initialSelection={printPreselect}
        onPrinted={({ share, insert }) => {
          if (share) setHasPrintedShares(true)
          if (insert) setHasPrintedInserts(true)
        }}
      />
      <ExportSaveModal
        isExportSaveModalActive={isExportSaveModalActive}
        setIsExportSaveModalActive={setIsExportSaveModalActive}
        selectedWordCount={+selectedWordCount}
        selectedScheme={selectedScheme}
        shares={shares!}
        sharesNumber={sharesNumber}
        onVerified={() => setHasVerified(true)}
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
