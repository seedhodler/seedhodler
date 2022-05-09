import React, { useState, useEffect, Dispatch, SetStateAction } from "react"

import { Modal } from "components/Modal"
import { BadgeColorsEnum } from "constants/index"

import { PrintContent } from "./components/PrintContent"
import { BackupContent } from "./components/BackupContent"

type Props = {
  isPrintModalActive: boolean
  setIsPrintModalActive: Dispatch<SetStateAction<boolean>>
  selectedWordCount: number
  mnemonic: string[]
  shares: string[] | null
}

const PostModal: React.FC<Props> = ({
  isPrintModalActive,
  setIsPrintModalActive,
  selectedWordCount,
  mnemonic,
  shares,
}) => {
  const [currentStep, setCurrentStep] = useState(0)

  const componentsInfo = {
    0: {
      title: "Print - Seedhodler Phraseholder",
      badgeColor: BadgeColorsEnum.Success,
      Component: (
        <PrintContent
          selectedWordCount={selectedWordCount}
          mnemonic={mnemonic}
          setCurrentStep={setCurrentStep}
        />
      ),
    },
    1: {
      title: "Backup",
      badgeColor: BadgeColorsEnum.Main,
      Component: <BackupContent shares={shares} />,
    },
  }
  const currentComponentInfo = componentsInfo[currentStep as keyof typeof componentsInfo]

  useEffect(() => {
    setCurrentStep(0)
  }, [isPrintModalActive])

  return (
    <Modal
      title={currentComponentInfo.title}
      isActive={isPrintModalActive}
      setIsActive={setIsPrintModalActive}
      badgeColor={currentComponentInfo.badgeColor}
    >
      {currentComponentInfo.Component}
    </Modal>
  )
}

export default PostModal
