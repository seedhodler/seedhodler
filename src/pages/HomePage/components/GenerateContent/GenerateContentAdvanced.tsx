import React, { Dispatch, SetStateAction } from "react"
import CardsIcon from "src/assets/icons/Cards.svg"
import CoinIcon from "src/assets/icons/Coin.svg"
import DiceIcon from "src/assets/icons/Dice.svg"
import HexIcon from "src/assets/icons/Hex.svg"
import NumbersIcon from "src/assets/icons/Numbers.svg"

import { InfoTitle } from "src/components/InfoTitle"
import { Textarea } from "src/components/Textarea"
import { assessEntropy, getEntropyDetails } from "src/helpers"
import variables from "src/styles/Variables.module.scss"

import { EntropyValueType } from "../EntropyValueType"
import classes from "./GenerateContent.module.scss"

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
  const handleEntropyChange = (id: number) => {
    setEntropyValue("")
    setEntropyTypeId(id)
  }

  // getEntropyDetails still drives the input filter (regex) and the generation
  // path; assessEntropy owns the human-facing readout and the quality warning.
  const { regex } = getEntropyDetails(entropyValue, minBits, entropyTypeId)
  const quality = assessEntropy(entropyValue, entropyTypeId, minBits)

  return (
    <>
      <div className={classes.entropyContainer}>
        <div className={classes.wrapperColumn}>
          <InfoTitle
            title="Value Type"
            desc="Choose the source of randomness you are entering: hex characters, coin flips, dice throws, digits, or cards drawn from a shuffled deck"
          />
          <div className={classes.entropyOptionsContainer}>
            {/* Display order only; the entropyTypeId of each type is fixed by the
                conversion logic and must not change. */}
            <EntropyValueType
              title="Numbers"
              subtitle="[0-9]"
              isActive={entropyTypeId === 3}
              onClick={() => handleEntropyChange(3)}
              icon={NumbersIcon}
            />
            <EntropyValueType
              title="Dice"
              subtitle="[1-6]"
              isActive={entropyTypeId === 2}
              onClick={() => handleEntropyChange(2)}
              icon={DiceIcon}
            />
            <EntropyValueType
              title="Coin Flip"
              subtitle="[0,1]"
              isActive={entropyTypeId === 1}
              onClick={() => handleEntropyChange(1)}
              icon={CoinIcon}
            />
            <EntropyValueType
              title="Cards"
              subtitle="[A-K cdhs]"
              isActive={entropyTypeId === 4}
              onClick={() => handleEntropyChange(4)}
              icon={CardsIcon}
            />
            <EntropyValueType
              title="HEX"
              subtitle="[0-9A-F]"
              isActive={entropyTypeId === 0}
              onClick={() => handleEntropyChange(0)}
              icon={HexIcon}
            />
          </div>
        </div>
      </div>
      <div className={classes.infoAndValidation}>
        <InfoTitle
          title="Enter your own entropy"
          // eslint-disable-next-line max-len
          desc="Use this text input field to manually enter your entropy. Seedhodler will only generate your master seed upon having entered a sufficient amount of data. This is shown in the small text field on the right side."
        />
        <div
          className={classes.validation}
          style={{
            backgroundColor: quality.enough ? variables.colorSuccessLight : variables.colorErrorLight,
          }}
        >
          {quality.enough
            ? `Enough entropy: ${quality.count} ${quality.unit} (${Math.min(
                minBits,
                Math.floor(quality.bits),
              )} of ${minBits} bits)`
            : `${quality.count} ${quality.unit}: ${Math.floor(
                quality.bits,
              )} of ${minBits} bits, ${quality.needMore} more ${quality.unit}`}
        </div>
      </div>
      {quality.weak && (
        <div className={classes.entropyWarning}>
          Weak entropy: {quality.reason}. Enter genuinely random values, not a pattern.
        </div>
      )}
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
