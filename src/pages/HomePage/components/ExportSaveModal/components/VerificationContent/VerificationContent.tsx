import React, { useState, useEffect, Dispatch, SetStateAction } from "react"

import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { ShareHeader } from "components/ShareHeader"
import { TextPlace } from "components/TextPlace"
import { Button } from "components/Button"
import variables from "styles/Variables.module.scss"
import { slip39wordlist, CLOSED_INPUTS_NUMBER } from "constants/index"
import { getOptions, getUniqueArr } from "helpers"

import classes from "../../ExportSaveModal.module.scss"

type Props = {
  shares: string[]
  sharesNumber: number
  selectedWordCount: number
  setCurrentStep: Dispatch<SetStateAction<number>>
}

const VerificationContent: React.FC<Props> = ({
  shares,
  sharesNumber,
  selectedWordCount,
  setCurrentStep,
}) => {
  const [currentShareId, setCurrentShareId] = useState(0)
  const splitShareItem = shares[currentShareId].split(" ")
  console.log(splitShareItem)
  const maxId = selectedWordCount === 12 ? 19 : 32
  const [closedWords, setClosedWords] = useState(
    getUniqueArr(0, maxId, CLOSED_INPUTS_NUMBER)
      .sort((a, b) => a - b)
      .map((listIndex, i) => {
        const word = splitShareItem[listIndex]
        return {
          index: listIndex,
          word,
          wordNumber: slip39wordlist.indexOf(word),
          isActive: i === 0 ? true : false,
          isFulfilled: false,
        }
      }),
  )
  const [options, setOptions] = useState(getOptions(closedWords.map(item => item.wordNumber)))

  const handleOptionClick = (word: string) => {
    const activeClosedWord = closedWords.find(item => item.isActive)
    const activeClosedWordIndex = closedWords.findIndex(item => item.isActive)

    if (activeClosedWord?.word === word) {
      activeClosedWord!.isActive = false
      activeClosedWord!.isFulfilled = true
      setClosedWords(prev =>
        prev.map((item, index) => {
          if (item.word === word) {
            return activeClosedWord!
          }
          if (index === activeClosedWordIndex + 1) {
            item.isActive = true
            return item
          }
          return item
        }),
      )
      setOptions(prev =>
        prev.map(item => {
          if (item.word === word) {
            item.selected = true
          }
          return item
        }),
      )
    }
  }

  const handleNext = () => {
    if (currentShareId + 1 < sharesNumber) {
      setCurrentShareId(prev => ++prev)
    } else {
      setCurrentStep(prev => ++prev)
    }
  }

  useEffect(() => {
    const newClosedWords = getUniqueArr(0, maxId, CLOSED_INPUTS_NUMBER)
      .sort((a, b) => a - b)
      .map((listIndex, i) => {
        const word = splitShareItem[listIndex]
        return {
          index: listIndex,
          word,
          wordNumber: slip39wordlist.indexOf(word),
          isActive: i === 0 ? true : false,
          isFulfilled: false,
        }
      })
    setClosedWords(newClosedWords)
    setOptions(getOptions(newClosedWords.map(item => item.wordNumber)))
  }, [currentShareId])

  return (
    <div className={classes.modalContentContainer}>
      <div style={{ width: "100%" }}>
        <div className={classes.descriptionContainer}>
          <p className={classes.description}>Lets verify your recovery phrase.</p>
          <p className={classes.shareNumberInfo}>
            {currentShareId + 1} / {sharesNumber} Shares
          </p>
        </div>
        <ShareHeader text={`Share - ${currentShareId + 1}`} style={{ marginBottom: "1.2rem" }} />
        <div className={classes.blockDivider}></div>
        <div
          className={classes.textPlacesContainer}
          style={{ height: selectedWordCount === 12 ? "560px" : "960px", marginBottom: "1.6rem" }}
        >
          {splitShareItem.map((word, index) => {
            let text = word
            const currentWordObj = closedWords.find(item => item.index === index)
            if (currentWordObj) {
              text = currentWordObj.isFulfilled ? currentWordObj.word : "......"
            }
            return (
              <TextPlace
                key={index}
                count={index + 1}
                text={text}
                style={{
                  marginBottom: "1.2rem",
                  width: "49%",
                  alignSelf: index <= (selectedWordCount === 12 ? 9 : 16) ? "flex-start" : "flex-end",
                  backgroundColor: currentWordObj ? variables.colorBg800 : "",
                  outline:
                    currentWordObj?.isActive || currentWordObj?.isFulfilled
                      ? `3px solid ${variables.colorMain}`
                      : "",
                  color:
                    currentWordObj?.isActive || currentWordObj?.isFulfilled ? variables.colorMain : "",
                }}
              />
            )
          })}
        </div>
        <p className={classes.additionalInfo} style={{ marginBottom: "2.4rem" }}>
          Please tap each word in the correct order
        </p>
        <div className={classes.optionsContainer}>
          {options.map(item => (
            <button
              key={item.word}
              onClick={() => handleOptionClick(item.word)}
              className={classes.option}
              style={{
                backgroundColor: item.selected ? variables.colorMain : "",
                cursor: item.selected ? "default" : "",
              }}
            >
              {item.word}
            </button>
          ))}
        </div>
      </div>
      <Button
        disabled={closedWords.some(item => !item.isFulfilled)}
        onClick={handleNext}
        iconRight={ArrowRightIcon}
      >
        Next
      </Button>
    </div>
  )
}

export default VerificationContent
