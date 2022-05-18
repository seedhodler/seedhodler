import React, { useState, useEffect, Dispatch, SetStateAction } from "react"

import { Modal } from "components/Modal"
import { BadgeColorsEnum } from "constants/index"

import { PrintContent } from "./components/PrintContent"
import { VerificationContent } from "./components/VerificationContent"
import { BackupContent } from "./components/BackupContent"
import { SuccessContent } from "./components/SuccessContent"

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

  const componentsInfo = {
    0: {
      title: "Print - Seedhodler Phraseholder",
      badgeColor: BadgeColorsEnum.SuccessLight,
      Component: (
        <PrintContent
          selectedWordCount={selectedWordCount}
          mnemonic={mnemonic}
          setCurrentStep={setCurrentStep}
          sharesNumber={sharesNumber}
        />
      ),
    },
    1: {
      title: "Backup",
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
      badgeColor: BadgeColorsEnum.Main,
      Component: (
        <VerificationContent
          shares={shares}
          sharesNumber={sharesNumber}
          selectedWordCount={selectedWordCount}
          setCurrentStep={setCurrentStep}
          verifiedShareIds={verifiedShareIds}
          setVerifiedShareIds={setVerifiedShareIds}
        />
      ),
    },
    3: {
      title: "Successful",
      badgeColor: BadgeColorsEnum.Success,
      Component: <SuccessContent setIsExportSaveModalActive={setIsExportSaveModalActive} />,
    },
  }
  const currentComponentInfo = componentsInfo[currentStep as keyof typeof componentsInfo]

  useEffect(() => {
    if (isExportSaveModalActive) {
      setCurrentStep(0)
      setShareId(0)
    }
  }, [isExportSaveModalActive])

  return (
    <Modal
      title={currentComponentInfo.title}
      isActive={isExportSaveModalActive}
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
