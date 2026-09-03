import React, { useContext } from "react"

import CheckmarkIcon from "src/assets/icons/CheckmarkFilledLight.svg"
import { BadgeTitle } from "src/components/BadgeTitle"
import { Button } from "src/components/Button"
import { Input } from "src/components/Input"
import { Select } from "src/components/Select"
import { TextPlace } from "src/components/TextPlace"
import { BadgeColorsEnum, schemeOptions, wordCountOptions } from "src/constants"
import type { Scheme } from "src/core"
import { RestoreContext } from "src/context/restoreContext"
import { useInputRefs } from "src/hooks"
import variables from "src/styles/Variables.module.scss"

import { bytewordsList, slip39wordlist } from "src/constants/"
import { Shares } from "../Shares"
import classes from "./RestoreContent.module.scss"

const RestoreContent: React.FC = () => {
  const {
    selectedWordCount,
    setSelectedWordCount,
    selectedScheme,
    setSelectedScheme,
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

  const handleWordCountChange = (wordCountValue: string) => {
    setSelectedWordCount(wordCountValue)
  }

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
      <div className={classes.headerContainer} style={{ marginBottom: "1.2rem" }}>
        <BadgeTitle
          title="Enter Splits"
          color={BadgeColorsEnum.MainLight}
          additionalInfo={selectedScheme === "sskr" ? "SSKR" : "SLIP-39"}
          headingLevel={2}
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
      <div className={classes.headerContainer} style={{ marginBottom: "3.6rem" }}>
        <div className={classes.wordCountContainer}>
          <p>Share scheme:</p>
          <Select
            defaultValue={selectedScheme}
            onChange={value => setSelectedScheme(value as Scheme)}
            options={schemeOptions}
          />
        </div>
      </div>
      <div className={classes.headerContainer} style={{ marginBottom: "1.2rem" }}>
        <h2 className={classes.title}>BIP39 Master Seed</h2>
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
      <Button
        onClick={handleAddShare}
        disabled={currentShare.some(word => word.length === 0) || !isCurrentShareValid}
        fullWidth
        style={{ marginBottom: "3.6rem" }}
      >
        Add split
      </Button>
      {enteredShares.length >= 1 && (
        <>
          <BadgeTitle
            title="Split Shares"
            color={BadgeColorsEnum.ErrorLight}
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
      <div className={classes.headerContainer} style={{ marginBottom: "3.6rem" }}>
        <BadgeTitle
          title="Recovered Master Seed"
          color={BadgeColorsEnum.SuccessLight}
          headingLevel={2}
          style={{ marginBottom: 0 }}
        />
        {isFullMnemonic && <img src={CheckmarkIcon} alt="Checkmark" />}
      </div>
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
    </>
  )
}

export default RestoreContent
