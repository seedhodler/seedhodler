import React, { useState, useEffect } from "react"

import Routes from "Routes"
import { ConnectionStatusModal } from "components/ConnectionStatusModal"

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  // TODO: revert
  const [isModalActive, setIsModalActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    window.addEventListener("online", () => setIsOnline(true))
    window.addEventListener("offline", () => setIsOnline(false))

    return () => {
      window.removeEventListener("online", () => setIsOnline(true))
      window.removeEventListener("offline", () => setIsOnline(false))
    }
  }, [])

  return (
    <>
      <ConnectionStatusModal
        isOnline={isOnline}
        isModalActive={isModalActive}
        setIsModalActive={setIsModalActive}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <Routes isOnline={isOnline} />
    </>
  )
}

export default App
