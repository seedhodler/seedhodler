import React, { Dispatch, SetStateAction, useEffect, useState } from "react"

import { Modal } from "src/components/Modal"
import { BadgeColorsEnum, bytewordsList, CLOSED_WORDS_NUMBER, slip39wordlist } from "src/constants"
import { type Scheme } from "src/core"
import { getOptions, getUniqueArr } from "src/helpers/index"

import { VerificationContent } from "./components/VerificationContent"
import { CompleteScreen } from "./components/CompleteScreen"

// The verification modal (reached from the "Verify" button). Printing blank forms
// is a separate flow now (PrintFormsModal); this modal only walks the user through
// checking, share by share, that the words were written down correctly, then the
// completion screen. The multiple-choice options are drawn from the scheme's own
// wordlist (SLIP-39 words or SSKR bytewords), and the closed positions span the
// full share length (20/33 words or 25/41 bytewords).

type Props = {
  isExportSaveModalActive: boolean
  setIsExportSaveModalActive: Dispatch<SetStateAction<boolean>>
  selectedWordCount: number
  selectedScheme: Scheme
  shares: string[]
  sharesNumber: number
}

const ExportSaveModal: React.FC<Props> = ({
  isExportSaveModalActive,
  setIsExportSaveModalActive,
  selectedWordCount,
  selectedScheme,
  shares,
  sharesNumber,
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [verifiedShareIds, setVerifiedShareIds] = useState<number[]>([])

  const wordlist = selectedScheme === "sskr" ? bytewordsList : slip39wordlist
  // Highest closable position = share length - 1. SLIP-39 shares are 20/33 words,
  // SSKR shares 25/41 bytewords.
  const shareLength =
    selectedScheme === "sskr" ? (selectedWordCount === 12 ? 25 : 41) : selectedWordCount === 12 ? 20 : 33
  const maxId = shareLength - 1

  const splitShares = shares?.map(share => share.split(" "))
  const [allClosedWords, setAllClosedWords] = useState(
    splitShares?.map(splitShare =>
      getUniqueArr(0, maxId, CLOSED_WORDS_NUMBER)
        .sort((a, b) => a - b)
        .map((listIndex, i) => {
          const word = splitShare[listIndex]
          return {
            index: listIndex,
            word,
            wordNumber: wordlist.indexOf(word),
            isActive: i === 0 ? true : false,
            isFulfilled: false,
            isError: false,
          }
        }),
    ),
  )
  const [allOptions, setAllOptions] = useState(
    allClosedWords?.map(closeWordsOneShare =>
      getOptions(closeWordsOneShare.map(wordObj => wordObj.wordNumber)),
    ),
  )

  // Step 0 is the verification itself, step 1 the completion screen. Back from
  // the first share would step below 0; there is no earlier step now, so close.
  const guardedSetStep: Dispatch<SetStateAction<number>> = updater => {
    setCurrentStep(prev => {
      const next = typeof updater === "function" ? (updater as (p: number) => number)(prev) : updater
      if (next < 0) {
        setIsExportSaveModalActive(false)
        return prev
      }
      return next
    })
  }

  const componentsInfo = {
    0: {
      title: "Verification",
      isSuccess: false,
      badgeColor: BadgeColorsEnum.Main,
      Component: (
        <VerificationContent
          shares={shares}
          sharesNumber={sharesNumber}
          setCurrentStep={guardedSetStep}
          verifiedShareIds={verifiedShareIds}
          setVerifiedShareIds={setVerifiedShareIds}
          allClosedWords={allClosedWords}
          allOptions={allOptions}
          setAllClosedWords={setAllClosedWords}
          setAllOptions={setAllOptions}
        />
      ),
    },
    1: {
      title: "Congratulations",
      isSuccess: true,
      badgeColor: BadgeColorsEnum.Success,
      Component: <CompleteScreen setIsExportSaveModalActive={setIsExportSaveModalActive} />,
    },
  }
  const currentComponentInfo = componentsInfo[currentStep as keyof typeof componentsInfo]

  useEffect(() => {
    if (isExportSaveModalActive) {
      setCurrentStep(0)
      setVerifiedShareIds([])
    }
  }, [isExportSaveModalActive])

  useEffect(() => {
    setVerifiedShareIds([])

    const newClosedWords = splitShares?.map(splitShare =>
      getUniqueArr(0, maxId, CLOSED_WORDS_NUMBER)
        .sort((a, b) => a - b)
        .map((listIndex, i) => {
          const word = splitShare[listIndex]
          return {
            index: listIndex,
            word,
            wordNumber: wordlist.indexOf(word),
            isActive: i === 0 ? true : false,
            isFulfilled: false,
            isError: false,
          }
        }),
    )
    setAllClosedWords(newClosedWords)
    setAllOptions(
      newClosedWords?.map(closeWordsOneShare =>
        getOptions(closeWordsOneShare.map(wordObj => wordObj.wordNumber), wordlist),
      ),
    )
  }, [shares])

  return (
    <Modal
      title={currentComponentInfo.title}
      isActive={isExportSaveModalActive}
      isSuccess={currentComponentInfo.isSuccess}
      isConfetti={currentStep === 1}
      setIsActive={setIsExportSaveModalActive}
      badgeColor={currentComponentInfo.badgeColor}
      style={{ height: "auto" }}
    >
      {/* Verification does real work over the shares on mount, so only build it
          once the modal is actually opened on an existing split. */}
      {isExportSaveModalActive && shares ? currentComponentInfo.Component : <></>}
    </Modal>
  )
}

export default ExportSaveModal
