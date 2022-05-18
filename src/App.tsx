import React, { useState, useEffect } from "react"

import Routes from "Routes"
import { Notification } from "components/Notification"

const App: React.FC = () => {
  const [isNotification, setIsNotification] = useState(false)
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)

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
      <Notification isActive={isNotification} setIsActive={setIsNotification} />
      <Routes isOnline={isOnline} />
    </>
  )
}

export default App
