import React, { useState, useEffect } from "react"

import Routes from "Routes"
import { Notification } from "components/Notification"
import { HelpModal } from "components/HelpModal"

const App: React.FC = () => {
  const [isNotification, setIsNotification] = useState(false)
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [isHelpModalActive, setIsHelpModalActive] = useState(true)

  useEffect(() => {
    const handlePrintScreenClick = (e: KeyboardEvent) => {
      if (e.code === "PrintScreen") {
        setIsNotification(true)
      }
    }

    window.addEventListener("online", () => setIsOnline(true))
    window.addEventListener("offline", () => setIsOnline(false))
    window.addEventListener("keyup", handlePrintScreenClick)

    return () => {
      window.removeEventListener("online", () => setIsOnline(true))
      window.removeEventListener("offline", () => setIsOnline(false))
      window.removeEventListener("keyup", handlePrintScreenClick)
    }
  }, [])

  return (
    <>
      <HelpModal isActive={isHelpModalActive} setIsActive={setIsHelpModalActive} />
      <Notification isActive={isNotification} setIsActive={setIsNotification} />
      <Routes isOnline={isOnline} setIsHelpModalActive={setIsHelpModalActive} />
    </>
  )
}

export default App
