import React, { useState, useEffect } from "react"

import Routes from "Routes"
import { Notification } from "components/Notification"
import { HelpModal } from "components/HelpModal"
import { RestoreContextProvider } from "context/restoreContext"
import { GenerateContextProvider } from "context/generateContext"

const App: React.FC = () => {
  const [isNotification, setIsNotification] = useState(false)
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [isHelpModalActive, setIsHelpModalActive] = useState(false)
  const [isNavFeaturedCardOpen, setIsNavFeaturedCardOpen] = useState(true)

  useEffect(() => {
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(true)
    const handlePrintScreenClick = (e: KeyboardEvent) => {
      if (e.code === "PrintScreen") {
        setIsNotification(true)
      }
    }

    window.addEventListener("online", onOnline)
    window.addEventListener("offline", onOffline)
    window.addEventListener("keyup", handlePrintScreenClick)

    return () => {
      window.removeEventListener("online", onOnline)
      window.removeEventListener("offline", onOffline)
      window.removeEventListener("keyup", handlePrintScreenClick)
    }
  }, [])

  return (
    <GenerateContextProvider>
      <RestoreContextProvider>
        <>
          <HelpModal isActive={isHelpModalActive} setIsActive={setIsHelpModalActive} />
          <Notification isActive={isNotification} setIsActive={setIsNotification} />
          <Routes
            isOnline={isOnline}
            setIsHelpModalActive={setIsHelpModalActive}
            isActive={isNavFeaturedCardOpen}
            setIsActive={setIsNavFeaturedCardOpen}
          />{" "}
        </>
      </RestoreContextProvider>
    </GenerateContextProvider>
  )
}

export default App
