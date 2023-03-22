import React, { useState, useEffect, Dispatch, SetStateAction } from "react"

import { Modal } from "components/Modal"
import { BadgeColorsEnum, CLOSED_WORDS_NUMBER, slip39wordlist } from "constants/index"
import { getOptions, getUniqueArr } from "helpers"

import { PrintContent } from "./components/PrintContent"
import { VerificationContent } from "./components/VerificationContent"
import { BackupContent } from "./components/BackupContent"
//TODO remove component in future if its not nessesary
// import { SuccessContent } from "./components/SuccessContent"
import { CompleteScreen } from "./components/CompleteScreen"

type Props = {
  isExportSaveModalActive: boolean
  setIsExportSaveModalActive: Dispatch<SetStateAction<boolean>>
  selectedWordCount: number
  mnemonic: string[]
  shares: string[]
  sharesNumber: number
}

const ExportSaveModal: React.FC<Props> = ({
  isExportSaveModalActive,
  setIsExportSaveModalActive,
  selectedWordCount,
  mnemonic,
  shares,
  sharesNumber,
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [shareId, setShareId] = useState(0)
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

  const componentsInfo = {
    0: {
      title: "Print - Seedhodler Phraseholder",
      isSuccess: false,
      badgeColor: BadgeColorsEnum.SuccessLight,
      Component: (
        <PrintContent
          selectedWordCount={selectedWordCount}
          mnemonic={mnemonic}
          sharesNumber={sharesNumber}
          setCurrentStep={setCurrentStep}
        />
      ),
    },
    1: {
      title: "Backup",
      isSuccess: false,
      badgeColor: BadgeColorsEnum.Main,
      Component: (
        <BackupContent
          shares={shares}
          setCurrentStep={setCurrentStep}
          selectedWordCount={selectedWordCount}
          sharesNumber={sharesNumber}
          shareId={shareId}
          setShareId={setShareId}
        />
      ),
    },
    2: {
      title: "Verification",
      isSuccess: false,
      badgeColor: BadgeColorsEnum.Main,
      Component: (
        <VerificationContent
          shares={shares}
          sharesNumber={sharesNumber}
          selectedWordCount={selectedWordCount}
          setCurrentStep={setCurrentStep}
          verifiedShareIds={verifiedShareIds}
          setVerifiedShareIds={setVerifiedShareIds}
          allClosedWords={allClosedWords}
          allOptions={allOptions}
          setAllClosedWords={setAllClosedWords}
          setAllOptions={setAllOptions}
        />
      ),
    },
    3: {
      title: "Congratulations",
      isSuccess: true,
      badgeColor: BadgeColorsEnum.Success,
      // TODO uncomment if SuccessContent component used
      // Component: <SuccessContent setIsExportSaveModalActive={setIsExportSaveModalActive} />,
      Component: <CompleteScreen setIsExportSaveModalActive={setIsExportSaveModalActive} />,
    },
  }
  const currentComponentInfo = componentsInfo[currentStep as keyof typeof componentsInfo]

  useEffect(() => {
    if (isExportSaveModalActive) {
      setCurrentStep(0)
      setShareId(0)
    }
  }, [isExportSaveModalActive])

  useEffect(() => {
    setVerifiedShareIds([])
    setShareId(0)

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
      isConfetti={currentStep === 3}
      setIsActive={setIsExportSaveModalActive}
      badgeColor={currentComponentInfo.badgeColor}
      style={{ height: "auto" }}
    >
      {currentComponentInfo.Component}
    </Modal>
  )
}

export default ExportSaveModal
