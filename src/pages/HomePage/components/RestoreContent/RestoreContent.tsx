import React, { useContext, useState } from "react"

import { BadgeTitle } from "src/components/BadgeTitle"
import { Button } from "src/components/Button"
import { CopyButton } from "src/components/CopyButton"
import { Input } from "src/components/Input"
import { SeedCard } from "src/components/SeedCard"
import { Select } from "src/components/Select"
import { ShareCardHeader } from "src/components/ShareCardHeader"
import { TextPlace } from "src/components/TextPlace"
import { BadgeColorsEnum, shareWordCountOptions } from "src/constants"
import { PRINTING_ENABLED } from "src/constants/config"
import { RestoreContext } from "src/context/restoreContext"
import { matchingFormKeys, type FormKey } from "src/helpers"
import { useInputRefs } from "src/hooks"
import variables from "src/styles/Variables.module.scss"

import { bytewordsList, slip39wordlist } from "src/constants/"
import { PrintFormsModal } from "../PrintFormsModal"
import { PrintUnavailableModal } from "../PrintUnavailableModal"
import classes from "./RestoreContent.module.scss"

const RestoreContent: React.FC = () => {
  const {
    shareWordCount,
    setShareWordCount,
    selectedWordCount,
    selectedScheme,
    shareLength,
    currentShare,
    setCurrentShare,
    isCurrentShareValid,
    threshold,
    enteredShares,
    setEnteredShares,
    activeShareItemId,
    setActiveShareItemId,
    restoredMnemonic,
    isFullMnemonic,
  } = useContext(RestoreContext)
  const inputRefs = useInputRefs(shareLength)

  // One paged card holds every share: the already-entered ones as read-only
  // pages, and a final page of empty fields for the next share. total = entered
  // + that entry page; the entry page is the last index.
  const totalPages = enteredShares.length + 1
  const pageIndex = Math.min(Math.max(activeShareItemId, 0), totalPages - 1)
  const isEntryPage = pageIndex >= enteredShares.length
  const isCurrentShareFull = currentShare.every(word => word.length !== 0)

  // The share card and the recovered seed carry the same controls as the
  // generated ones (hide, copy, print), plus delete on an entered share.
  const [seedHidden, setSeedHidden] = useState(false)
  const [shareHidden, setShareHidden] = useState(false)
  const [isPrintModalActive, setIsPrintModalActive] = useState(false)
  const [printPreselect, setPrintPreselect] = useState<FormKey[] | undefined>(undefined)
  // The offline build keeps the print controls but cannot print; a click points
  // to the website instead (see PrintUnavailableModal).
  const [isPrintUnavailableActive, setIsPrintUnavailableActive] = useState(false)
  const openPrint = (keys?: FormKey[]) => {
    if (!PRINTING_ENABLED) {
      setIsPrintUnavailableActive(true)
      return
    }
    setPrintPreselect(keys)
    setIsPrintModalActive(true)
  }
  const seedFormKey: FormKey = selectedWordCount === "12" ? "seed12" : "seed24"
  const shareFormKey = matchingFormKeys(+selectedWordCount, selectedScheme)[1]

  // The words shown on the active page, and whether there is anything to act on.
  const displayedWords = isEntryPage ? currentShare : enteredShares[pageIndex]
  const hasContent = displayedWords.some(word => word.length > 0)

  const handleAddShare = () => {
    // After adding, land on the fresh empty entry page and focus its first field.
    const nextEntryPage = enteredShares.length + 1
    setEnteredShares(prev => [...prev, currentShare])
    setCurrentShare(new Array(shareLength).fill(""))
    setActiveShareItemId(nextEntryPage)
    requestAnimationFrame(() => inputRefs[0]?.current?.focus())
  }

  const handleDeleteShare = () => {
    setEnteredShares(prev => prev.filter((_, index) => index !== pageIndex))
    // Fall back to the entry page of the shortened list.
    setActiveShareItemId(Math.max(0, enteredShares.length - 1))
  }

  const onEnter = (index: number) => {
    if (index < shareLength - 1) {
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
      <div className={classes.headerContainer} style={{ marginBottom: "3.6rem" }}>
        <BadgeTitle
          title="Enter Shares"
          color={BadgeColorsEnum.Main}
          headingLevel={2}
          style={{ marginBottom: 0 }}
        />
        <div className={classes.wordCountContainer}>
          <p>Words per share</p>
          <Select
            value={shareWordCount}
            defaultValue={shareWordCount}
            onChange={setShareWordCount}
            options={shareWordCountOptions}
          />
        </div>
      </div>
      {/* One paged card holds every share: the entered ones as read-only pages
          and a final page of empty fields for the next share, all under the same
          "Share N of M" header and prev/next navigation. */}
      <div className={classes.shareCard}>
        <ShareCardHeader
          activeIndex={pageIndex}
          total={totalPages}
          wordCount={shareLength}
          scheme={selectedScheme}
          onNavigate={setActiveShareItemId}
          actions={
            <div className={classes.shareActions}>
              {isEntryPage && isCurrentShareFull && (
                <div
                  className={classes.validation}
                  style={{
                    backgroundColor: isCurrentShareValid
                      ? variables.colorSuccessLight
                      : variables.colorErrorLight,
                  }}
                >
                  {isCurrentShareValid ? "Valid entry" : "Invalid entry"}
                </div>
              )}
              {hasContent && (
                <button
                  type="button"
                  className={classes.seedIconBtn}
                  onClick={() => setShareHidden(hidden => !hidden)}
                  aria-label={shareHidden ? "Reveal share" : "Hide share"}
                  title={shareHidden ? "Reveal share" : "Hide share"}
                >
                  {shareHidden ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              )}
              {hasContent && (
                <CopyButton
                  getText={() => displayedWords.join(" ")}
                  className={classes.seedIconBtn}
                  title="Copy share words"
                />
              )}
              <button
                type="button"
                className={classes.seedIconBtn}
                onClick={() => openPrint(shareFormKey ? [shareFormKey] : undefined)}
                aria-label="Print the matching share form"
                title="Print the matching share form"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              </button>
              {!isEntryPage && (
                <button
                  type="button"
                  className={classes.seedIconBtn}
                  onClick={handleDeleteShare}
                  aria-label="Delete this share"
                  title="Delete this share"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              )}
            </div>
          }
        />
        <div className={classes.shareCardDivider} />
        <div className={classes.wordWrap}>
          <div
            className={`${classes.wordGrid} ${shareHidden && hasContent ? classes.seedBlurred : ""}`}
            style={{ gridTemplateRows: `repeat(${Math.ceil(shareLength / 2)}, auto)` }}
          >
          {isEntryPage
            ? currentShare.map((word, index) => (
                <Input
                  key={index}
                  ref={inputRefs[index]}
                  onEnter={onEnter}
                  onClick={onClick}
                  wordlist={selectedScheme === "sskr" ? bytewordsList : slip39wordlist}
                  count={index + 1}
                  total={shareLength}
                  index={index}
                  value={word}
                  onChange={setCurrentShare}
                  containerStyle={{ marginBottom: 0 }}
                />
              ))
            : enteredShares[pageIndex].map((word, index) => (
                <TextPlace
                  key={index}
                  text={word}
                  count={index + 1}
                  style={{ width: "auto", marginBottom: 0 }}
                />
              ))}
          </div>
          {shareHidden && hasContent && (
            <button type="button" className={classes.seedReveal} onClick={() => setShareHidden(false)}>
              Reveal share
            </button>
          )}
        </div>
      </div>
      {isEntryPage && (
        <Button
          onClick={handleAddShare}
          disabled={!isCurrentShareFull || !isCurrentShareValid}
          fullWidth
          style={{ marginTop: "2.4rem", marginBottom: "3.6rem" }}
        >
          Add share
        </Button>
      )}
      {enteredShares.length >= 1 && (
        <div className={classes.progress}>
          <div className={classes.progressTrack}>
            <div
              className={classes.progressFill}
              style={{
                width: `${threshold ? Math.min(100, (enteredShares.length / threshold) * 100) : 0}%`,
                backgroundColor: isFullMnemonic ? variables.colorSuccess : variables.colorMain,
              }}
            />
          </div>
          <p
            className={classes.progressText}
            style={isFullMnemonic ? { color: variables.colorSuccess } : undefined}
          >
            {isFullMnemonic
              ? "Master seed recovered"
              : threshold
                ? `${threshold - enteredShares.length} more share${
                    threshold - enteredShares.length === 1 ? "" : "s"
                  } needed`
                : `${enteredShares.length} share${
                    enteredShares.length === 1 ? "" : "s"
                  } entered`}
          </p>
        </div>
      )}
      {/* Recovering the seed is a new section: a full-width rule and generous
          spacing set the recovered seed apart from the shares above it. */}
      <div className={classes.sectionDivider} />
      {/* Same framed card as the generated master seed, so the recovered seed
          reads identically. */}
      <SeedCard
        title="Recovered Master Seed"
        wordCount={selectedWordCount}
        actions={
          isFullMnemonic ? (
            <>
              <button
                type="button"
                className={classes.seedIconBtn}
                onClick={() => setSeedHidden(hidden => !hidden)}
                aria-label={seedHidden ? "Reveal seed" : "Hide seed"}
                title={seedHidden ? "Reveal seed" : "Hide seed"}
              >
                {seedHidden ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
              <CopyButton
                getText={() => restoredMnemonic.join(" ")}
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              </button>
            </>
          ) : undefined
        }
      >
        <div className={classes.wordWrap}>
          {/* Deterministic column-first grid: exactly N/2 tiles per column, so
              the boundary tile never lands between the columns. */}
          <div
            className={`${classes.wordGrid} ${seedHidden ? classes.seedBlurred : ""}`}
            style={{ gridTemplateRows: `repeat(${Math.ceil(+selectedWordCount / 2)}, auto)` }}
          >
            {restoredMnemonic.map((word, index) => (
              <TextPlace
                key={index}
                text={word}
                count={index + 1}
                isSuccess={isFullMnemonic}
                style={{ width: "auto", marginBottom: 0 }}
              />
            ))}
          </div>
          {seedHidden && (
            <button type="button" className={classes.seedReveal} onClick={() => setSeedHidden(false)}>
              Reveal seed
            </button>
          )}
        </div>
      </SeedCard>

      <PrintFormsModal
        isActive={isPrintModalActive}
        setIsActive={setIsPrintModalActive}
        selectedWordCount={+selectedWordCount}
        selectedScheme={selectedScheme}
        sharesNumber={1}
        initialSelection={printPreselect}
      />
      <PrintUnavailableModal
        isActive={isPrintUnavailableActive}
        setIsActive={setIsPrintUnavailableActive}
      />
    </>
  )
}

export default RestoreContent
