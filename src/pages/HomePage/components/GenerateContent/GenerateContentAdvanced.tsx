import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import CoinIcon from "assets/icons/Coin.svg"
import CardsIcon from "assets/icons/Cards.svg"
import DiceIcon from "assets/icons/Dice.svg"
import NumbersIcon from "assets/icons/Numbers.svg"

// import { Button } from "components/Button"
import { BadgeTitle } from "components/BadgeTitle"
import { InfoTitle } from "components/InfoTitle"
import { Textarea } from "components/Textarea"
import variables from "styles/Variables.module.scss"
import { getEntropyDetails, getEntropyFromMouse } from "helpers"

import { EntropyValueType } from "../EntropyValueType"
import classes from "./GenerateContent.module.scss"

const entropy: number[] = []

type GenerateContentAdvancedProps = {
  minBits: 128 | 256
  setEntropyValue: Dispatch<SetStateAction<string>>
  entropyValue: string
  entropyTypeId: number
  setEntropyTypeId: Dispatch<SetStateAction<number>>
}

export const GenerateContentAdvanced: React.FC<GenerateContentAdvancedProps> = ({
  minBits,
  setEntropyValue,
  entropyValue,
  entropyTypeId,
  setEntropyTypeId,
}) => {
  // const [mousePercentage, setMousePercentage] = useState(0)
  // const [isMouseCapture, setIsMouseCapture] = useState(false)

  // const onMouseMove = useCallback(
  //   (e: MouseEvent) =>
  //     getEntropyFromMouse(e, minBits, entropy, setIsMouseCapture, setEntropyValue, setMousePercentage),
  //   [minBits, setEntropyValue],
  // )
  // useEffect(() => {
  //   if (!isMouseCapture) {
  //     document.removeEventListener("mousemove", onMouseMove)
  //   }
  // }, [isMouseCapture, onMouseMove])

  // const handleMouseEntropy = () => {
  //   setEntropyTypeId(0)
  //   setMousePercentage(0)

  //   if (!isMouseCapture) {
  //     setIsMouseCapture(true)
  //     document.addEventListener("mousemove", onMouseMove)
  //     if (entropy.length >= minBits) {
  //       entropy.length = 0
  //       setEntropyValue("")
  //     }
  //   } else {
  //     setIsMouseCapture(false)
  //     document.removeEventListener("mousemove", onMouseMove)
  //   }
  // }

  const handleEntropyChange = (id: number) => {
    setEntropyValue("")
    setEntropyTypeId(id)
  }

  const { selectedEntropyDetails, regex, selectedEntropyAsBinary } = getEntropyDetails(
    entropyValue,
    minBits,
    entropyTypeId,
  )
  const isEntropyTooShort = selectedEntropyDetails.totalBits < minBits

  return (
    <>
      <BadgeTitle title="Entropy Generation" style={{ marginBottom: "2.6rem" }} />
      <div className={classes.entropyContainer}>
        <div className={classes.wrapperColumn}>
          <InfoTitle
            title="Entropy Value Type"
            desc="Choose what type of random number generator you are using. Such as a deck of cards or flipping a coin"
          />
          <div className={classes.entropyOptionsContainer}>
            <EntropyValueType
              title="HEX"
              subtitle="[0-9A-F]"
              isActive={entropyTypeId === 0}
              onClick={() => handleEntropyChange(0)}
              icon={CardsIcon}
            />
            <EntropyValueType
              title="Coin Flip"
              subtitle="[0,1]"
              isActive={entropyTypeId === 1}
              onClick={() => handleEntropyChange(1)}
              icon={CoinIcon}
            />
            <EntropyValueType
              title="Dice"
              subtitle="[1-6]"
              isActive={entropyTypeId === 2}
              onClick={() => handleEntropyChange(2)}
              icon={DiceIcon}
            />
            <EntropyValueType
              title="Numbers"
              subtitle="[0-9]"
              isActive={entropyTypeId === 3}
              onClick={() => handleEntropyChange(3)}
              icon={NumbersIcon}
            />
          </div>
        </div>
        {/* <div className={classes.wrapperColumn}>
          <InfoTitle title="Mouse" desc="Mouse __placeholder" />
          <Button onClick={handleMouseEntropy} className={classes["mouseButton" + mousePercentage]}>
            {isMouseCapture ? "Calculating..." : "Calculate"}
          </Button>
        </div> */}
      </div>
      <div className={classes.infoAndValidation}>
        <InfoTitle
          title="Manual - Enter your own entropy"
          // eslint-disable-next-line max-len
          desc="Use this text input field to manually enter your entropy. Seedhodler will only generate your master seed upon having entered a sufficient amount of data. This is shown in the small text field on the right side."
        />
        <div
          className={classes.validation}
          style={{
            backgroundColor: isEntropyTooShort ? variables.colorErrorLight : variables.colorSuccessLight,
          }}
        >
          {isEntropyTooShort ? "Entropy is too short" : "Valid Entropy"} (
          {`${Math.min(minBits, Math.floor(selectedEntropyDetails.totalBits))} / ${minBits}`})
        </div>
      </div>
      <Textarea
        value={entropyValue}
        onChange={setEntropyValue}
        regex={regex}
        minBits={minBits}
        entropyTypeId={entropyTypeId}
        style={{ marginBottom: "3.4rem" }}
      />
    </>
  )
}
