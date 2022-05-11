import React, { useState, useEffect } from "react"

import Routes from "Routes"
import { Notification } from "components/Notification"
import { ConnectionStatusModal } from "components/ConnectionStatusModal"

const App: React.FC = () => {
  const [isNotification, setIsNotification] = useState(false)
  const [isModalActive, setIsModalActive] = useState(true)
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    window.addEventListener("online", () => setIsOnline(true))
    window.addEventListener("offline", () => setIsOnline(false))
    window.addEventListener("keyup", e => {
      if (e.code === "PrintScreen") {
        setIsNotification(true)
      }
    })

    return () => {
      window.removeEventListener("online", () => setIsOnline(true))
      window.removeEventListener("offline", () => setIsOnline(false))
      window.removeEventListener("keyup", e => {
        if (e.code === "PrintScreen") {
          setIsNotification(true)
        }
      })
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
      <Notification isActive={isNotification} setIsActive={setIsNotification} />
      <Routes isOnline={isOnline} />
    </>
  )
}

export default App
