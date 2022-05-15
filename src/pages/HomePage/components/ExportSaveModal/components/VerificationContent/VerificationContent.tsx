import React, { useState } from "react"

import ArrowRightIcon from "assets/icons/ArrowRight.svg"
import { ShareHeader } from "components/ShareHeader"
import { TextPlace } from "components/TextPlace"
import { Button } from "components/Button"
import variables from "styles/Variables.module.scss"
import { slip39wordlist } from "constants/index"

import classes from "../../ExportSaveModal.module.scss"

// TODO: temp
import { getOptions, getUniqueArr } from "helpers/VERIFICATION_UTILS"

const CLOSED_INPUTS_NUMBER = 5

type Props = {
  shares: string[]
  sharesNumber: number
  selectedWordCount: number
}

const VerificationContent: React.FC<Props> = ({ shares, sharesNumber, selectedWordCount }) => {
  const [currentShareId, setCurrentShareId] = useState(0)
  const splitShareItem = shares[currentShareId].split(" ")

  const maxId = selectedWordCount === 12 ? 19 : 32
  const closedWords = getUniqueArr(0, maxId, CLOSED_INPUTS_NUMBER)
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
  const options = getOptions(closedWords.map(item => item.wordNumber))

  const handleNext = () => {
    setCurrentShareId(prev => ++prev)
  }

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
            <button key={item.word} className={classes.option}>
              {item.word}
            </button>
          ))}
        </div>
      </div>
      <Button onClick={handleNext} iconRight={ArrowRightIcon}>
        Next
      </Button>
    </div>
  )
}

export default VerificationContent
