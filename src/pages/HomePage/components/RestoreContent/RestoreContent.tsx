import React, { useState, useEffect } from "react"

import CheckmarkIcon from "assets/icons/CheckmarkFilledLight.svg"
import { BadgeTitle } from "components/BadgeTitle"
import { Select } from "components/Select"
import { InfoTitle } from "components/InfoTitle"
import { Input } from "components/Input"
import { Button } from "components/Button"
import { TextPlace } from "components/TextPlace"
import { BadgeColorsEnum, wordCountOptions } from "constants/"
import variables from "styles/Variables.module.scss"

import { Shares } from "../Shares"
import classes from "./RestoreContent.module.scss"

const RestoreContent: React.FC = () => {
  const [selectedWordCount, setSelectedWordCount] = useState(wordCountOptions[0].value)
  const shareLength = selectedWordCount === "12" ? 20 : 33
  const [currentShare, setCurrentShare] = useState(new Array(shareLength).fill(""))
  // TODO: change temp
  const [enteredShares, setEnteredShares] = useState<string[][]>(
    [new Array(shareLength).fill("aaa"), new Array(shareLength).fill("bbdsadsb")] /* [] */,
  )
  const [activeShareItemId, setActiveShareItemId] = useState(0)
  const formattedShares = enteredShares.map(shareItem => shareItem.join(" "))
  // TODO: change temp
  const [mnemonic, setMnemonic] = useState(new Array(+selectedWordCount).fill("word") /* [] */)

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

  console.log(enteredShares)

  useEffect(() => {
    setActiveShareItemId(0)
    setCurrentShare(new Array(shareLength).fill(""))
    // TODO: change temp
    setEnteredShares(
      [new Array(shareLength).fill("aaa"), new Array(shareLength).fill("bbdsadsb")] /* [] */,
    )
    // TODO: change temp
    setMnemonic(new Array(+selectedWordCount).fill("word") /* [] */)
  }, [shareLength, selectedWordCount])

  return (
    <>
      <div className={classes.headerContainer} style={{ marginBottom: "3.6rem" }}>
        <BadgeTitle
          title="Input Phrases"
          isInfo={true}
          desc="Input Phrases __placeholder"
          color={BadgeColorsEnum.MainLight}
          additionalInfo="BIP 39"
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
      <div className={classes.headerContainer} style={{ marginBottom: "1.2rem" }}>
        <InfoTitle title="BIP39 Seed Phrase" desc="BIP39 Seed Phrase __placeholder" />
        <div className={classes.validation}>Valid Entry (155)</div>
      </div>
      <div
        className={classes.shareContainer}
        style={{ height: selectedWordCount === "12" ? "600px" : "1020px" }}
      >
        {currentShare.map((word, index) => (
          <Input
            key={index}
            isRestore={true}
            count={index + 1}
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
        disabled={currentShare.some(word => word.length === 0)}
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
            style={{ marginBottom: "3.6rem" }}
          />
          <div className={classes.sharesCountContainer}>
            <div className={classes.validation} style={{ backgroundColor: variables.colorBg200 }}>
              {enteredShares.length} of ? splits added - ? splits remaining
            </div>
          </div>
          <Shares
            isRestore
            shares={formattedShares}
            selectedWordCount={+selectedWordCount}
            activeShareItemId={activeShareItemId}
            setActiveShareItemId={setActiveShareItemId}
            onDelete={handleDeleteShare}
          />
        </>
      )}
      <div className={classes.headerContainer} style={{ marginBottom: "3.6rem" }}>
        <BadgeTitle
          title="Recovered Phrase"
          color={BadgeColorsEnum.SuccessLight}
          style={{ marginBottom: 0 }}
        />
        <img src={CheckmarkIcon} alt="Checkmark" />
      </div>
      <div
        className={classes.shareContainer}
        style={{ height: selectedWordCount === "12" ? "360px" : "720px" }}
      >
        {mnemonic.map((word, index) => (
          <TextPlace
            text={word}
            count={index + 1}
            isSuccess
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
