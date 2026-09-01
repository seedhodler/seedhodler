import React, { Dispatch, SetStateAction, useEffect, useState } from "react"

import { Modal } from "src/components/Modal"
import { BadgeColorsEnum, CLOSED_WORDS_NUMBER, slip39wordlist } from "src/constants"
import { getOptions, getUniqueArr } from "src/helpers/index"

import { VerificationContent } from "./components/VerificationContent"
import { CompleteScreen } from "./components/CompleteScreen"

// The verification modal (reached from the "Verify" button). Printing blank forms
// is a separate flow now (PrintFormsModal); this modal only walks the user through
// checking, share by share, that the words were written down correctly, then the
// completion screen. Verification is SLIP-39 only for now: it builds its
// multiple-choice options from the SLIP-39 wordlist, so the Verify button is
// disabled for SSKR splits upstream.

type Props = {
  isExportSaveModalActive: boolean
  setIsExportSaveModalActive: Dispatch<SetStateAction<boolean>>
  selectedWordCount: number
  shares: string[]
  sharesNumber: number
}

const ExportSaveModal: React.FC<Props> = ({
  isExportSaveModalActive,
  setIsExportSaveModalActive,
  selectedWordCount,
  shares,
  sharesNumber,
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [verifiedShareIds, setVerifiedShareIds] = useState<number[]>([])

  const splitShares = shares?.map(share => share.split(" "))
  const maxId = selectedWordCount === 12 ? 19 : 32
  const [allClosedWords, setAllClosedWords] = useState(
    splitShares?.map(splitShare =>
      getUniqueArr(0, maxId, CLOSED_WORDS_NUMBER)
        .sort((a, b) => a - b)
        .map((listIndex, i) => {
          const word = splitShare[listIndex]
          return {
            index: listIndex,
            word,
            wordNumber: slip39wordlist.indexOf(word),
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
            wordNumber: slip39wordlist.indexOf(word),
            isActive: i === 0 ? true : false,
            isFulfilled: false,
            isError: false,
          }
        }),
    )
    setAllClosedWords(newClosedWords)
    setAllOptions(
      newClosedWords?.map(closeWordsOneShare =>
        getOptions(closeWordsOneShare.map(wordObj => wordObj.wordNumber)),
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
