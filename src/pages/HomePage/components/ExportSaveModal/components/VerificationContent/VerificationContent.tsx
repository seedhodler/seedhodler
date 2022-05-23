import React, { useState, useRef, Dispatch, SetStateAction } from "react"

import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import ArrowLeftIcon from "assets/icons/ArrowLeft.svg"
import { ShareHeader } from "components/ShareHeader"
import { TextPlace } from "components/TextPlace"
import { Button } from "components/Button"
import variables from "styles/Variables.module.scss"
import { NavigationEnum } from "constants/"

import classes from "../../ExportSaveModal.module.scss"

type Props = {
  shares: string[]
  sharesNumber: number
  selectedWordCount: number
  setCurrentStep: Dispatch<SetStateAction<number>>
  verifiedShareIds: number[]
  setVerifiedShareIds: Dispatch<SetStateAction<number[]>>
  allClosedWords: {
    index: number
    word: string
    wordNumber: number
    isActive: boolean
    isFulfilled: boolean
    isError: boolean
  }[][]
  allOptions: { word: string; wordNumber: number; selected: boolean }[][]
  setAllClosedWords: Dispatch<
    SetStateAction<
      {
        index: number
        word: string
        wordNumber: number
        isActive: boolean
        isFulfilled: boolean
        isError: boolean
      }[][]
    >
  >
  setAllOptions: Dispatch<SetStateAction<{ word: string; wordNumber: number; selected: boolean }[][]>>
}

const VerificationContent: React.FC<Props> = ({
  shares,
  sharesNumber,
  selectedWordCount,
  setCurrentStep,
  verifiedShareIds,
  setVerifiedShareIds,
  allClosedWords,
  allOptions,
  setAllClosedWords,
  setAllOptions,
}) => {
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const [currentShareId, setCurrentShareId] = useState(0)
  const splitShareItem = shares[currentShareId].split(" ")
  const closedWords = allClosedWords[currentShareId]
  const options = allOptions[currentShareId]

  const handleOptionClick = (word: string) => {
    const activeClosedWord = closedWords.find(item => item.isActive)
    const activeClosedWordIndex = closedWords.findIndex(item => item.isActive)

    if (activeClosedWord?.word === word) {
      activeClosedWord!.isActive = false
      activeClosedWord!.isFulfilled = true
      setAllClosedWords(prev =>
        prev.map((closedWordsArr, i) => {
          if (i === currentShareId) {
            closedWordsArr.map((item, index) => {
              if (item.word === word) {
                return activeClosedWord!
              }
              if (index === activeClosedWordIndex + 1) {
                item.isActive = true
                return item
              }
              return item
            })
          }
          return closedWordsArr
        }),
      )
      setAllOptions(prev =>
        prev.map((optionsArr, i) => {
          if (i === currentShareId) {
            optionsArr.map(item => {
              if (item.word === word) {
                item.selected = true
              }
              return item
            })
          }
          return optionsArr
        }),
      )
    } else {
      activeClosedWord!.isError = true
      setAllClosedWords(prev =>
        prev.map((closedWordsArr, i) => {
          if (i === currentShareId) {
            closedWordsArr.map((item, index) => {
              if (item.word === word) {
                return activeClosedWord!
              }
              return item
            })
          }
          return closedWordsArr
        }),
      )
    }
  }

  const handleNavigation = (type: NavigationEnum) => {
    if (type === NavigationEnum.Next) {
      if (!verifiedShareIds.includes(currentShareId)) {
        setVerifiedShareIds(prev => [...prev, currentShareId])
      }
      if (currentShareId + 1 < sharesNumber) {
        setCurrentShareId(prev => ++prev)
      } else {
        setCurrentStep(prev => ++prev)
      }
    } else {
      if (currentShareId === 0) {
        setCurrentStep(prev => --prev)
      } else {
        setCurrentShareId(prev => --prev)
      }
    }
  }

  return (
    <div ref={containerRef} className={classes.modalContentContainer}>
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
            if (currentWordObj && !verifiedShareIds.includes(currentShareId)) {
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
                    currentWordObj?.isActive && currentWordObj?.isError
                      ? `3px solid ${variables.colorError}`
                      : currentWordObj?.isActive || currentWordObj?.isFulfilled
                      ? `3px solid ${variables.colorMain}`
                      : "",
                  color:
                    currentWordObj?.isActive && currentWordObj?.isError
                      ? variables.colorError
                      : currentWordObj?.isActive || currentWordObj?.isFulfilled
                      ? variables.colorMain
                      : "",
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
      <div className={classes.buttonsContainer}>
        <Button onClick={() => handleNavigation(NavigationEnum.Prev)} iconLeft={ArrowLeftIcon}>
          Prev
        </Button>
        <Button
          disabled={closedWords.some(item => !item.isFulfilled)}
          onClick={() => handleNavigation(NavigationEnum.Next)}
          iconRight={ArrowRightIcon}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default VerificationContent
