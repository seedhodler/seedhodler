import React, { useContext } from "react"

import CheckmarkIcon from "src/assets/icons/CheckmarkFilledLight.svg"
import { BadgeTitle } from "src/components/BadgeTitle"
import { Button } from "src/components/Button"
import { Input } from "src/components/Input"
import { SchemeBadge } from "src/components/SchemeBadge"
import { SeedCard } from "src/components/SeedCard"
import { Select } from "src/components/Select"
import { TextPlace } from "src/components/TextPlace"
import { BadgeColorsEnum, shareWordCountOptions } from "src/constants"
import { RestoreContext } from "src/context/restoreContext"
import { useInputRefs } from "src/hooks"
import variables from "src/styles/Variables.module.scss"

import { bytewordsList, slip39wordlist } from "src/constants/"
import { Shares } from "../Shares"
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
    infoMessage,
    enteredShares,
    setEnteredShares,
    activeShareItemId,
    setActiveShareItemId,
    enteredSharesAsString,
    restoredMnemonic,
    isFullMnemonic,
  } = useContext(RestoreContext)
  const inputRefs = useInputRefs(shareLength)

  const handleAddShare = () => {
    setEnteredShares(prev => [...prev, currentShare])
    setCurrentShare(new Array(shareLength).fill(""))
  }

  const handleDeleteShare = () => {
    setEnteredShares(prev => prev.filter((_, index) => index !== activeShareItemId))
    setActiveShareItemId(0)
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
      {/* The share being entered sits in the same framed card with a header as
          the share element under generate. */}
      <div className={classes.shareCard}>
        <div className={classes.shareCardHeader}>
          <div className={classes.shareCardTitleGroup}>
            <h3 className={classes.shareCardTitle}>Share</h3>
            <div className={classes.shareCardMeta}>
              <SchemeBadge scheme={selectedScheme} />
              <span className={classes.shareCardCount}>{shareLength} words</span>
            </div>
          </div>
          {currentShare.every(word => word.length !== 0) && (
            <div
              className={classes.validation}
              style={{
                backgroundColor: isCurrentShareValid
                  ? variables.colorSuccessLight
                  : variables.colorErrorLight,
              }}
            >
              {isCurrentShareValid ? "Valid Entry" : "Invalid entry"}
            </div>
          )}
        </div>
        <div className={classes.shareCardDivider} />
        <div
          className={classes.shareContainer}
          style={{ height: `${Math.ceil(shareLength / 2) * 60}px` }}
        >
          {currentShare.map((word, index) => (
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
              containerStyle={{
                width: "49%",
                marginBottom: "1.2rem",
                alignSelf: index >= shareLength / 2 ? "flex-end" : "flex-start",
              }}
            />
          ))}
        </div>
      </div>
      <Button
        onClick={handleAddShare}
        disabled={currentShare.some(word => word.length === 0) || !isCurrentShareValid}
        fullWidth
        style={{ marginBottom: "3.6rem" }}
      >
        Add share
      </Button>
      {enteredShares.length >= 1 && (
        <>
          <BadgeTitle
            title="Entered Shares"
            color={BadgeColorsEnum.Main}
            headingLevel={2}
            style={{ marginBottom: "3.6rem" }}
          />
          {infoMessage.length > 0 && (
            <div className={classes.sharesCountContainer}>
              <div
                className={classes.validation}
                style={{
                  backgroundColor: restoredMnemonic[0].length
                    ? variables.colorSuccessLight
                    : variables.colorBg200,
                }}
              >
                {infoMessage}
              </div>
            </div>
          )}
          <Shares
            isRestore
            shares={enteredSharesAsString}
            activeShareItemId={activeShareItemId}
            setActiveShareItemId={setActiveShareItemId}
            scheme={selectedScheme}
            onDelete={handleDeleteShare}
          />
        </>
      )}
      {/* Recovering the seed is a new section: a full-width rule and generous
          spacing set the recovered seed apart from the shares above it. */}
      <div className={classes.sectionDivider} />
      {/* Same framed card as the generated master seed, so the recovered seed
          reads identically. */}
      <SeedCard
        title="Recovered Master Seed"
        wordCount={selectedWordCount}
        actions={isFullMnemonic ? <img src={CheckmarkIcon} alt="Checkmark" /> : undefined}
      >
        <div
          className={classes.shareContainer}
          style={{ height: selectedWordCount === "12" ? "360px" : "710px" }}
        >
          {restoredMnemonic.map((word, index) => (
            <TextPlace
              key={index}
              text={word}
              count={index + 1}
              isSuccess={isFullMnemonic}
              style={{
                alignSelf: index >= +selectedWordCount / 2 ? "flex-end" : "flex-start",
              }}
            />
          ))}
        </div>
      </SeedCard>
    </>
  )
}

export default RestoreContent
