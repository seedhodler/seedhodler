import React, { useState, useEffect } from "react"

import { Detector } from "react-detect-offline"
import Routes from "Routes"
import { Notification } from "components/Notification"
import { HelpModal } from "components/HelpModal"
import { RestoreContextProvider } from "context/restoreContext"
import { GenerateContextProvider } from "context/generateContext"

const App: React.FC = () => {
  const [isNotification, setIsNotification] = useState(false)
  const [isHelpModalActive, setIsHelpModalActive] = useState(false)
  const [isNavFeaturedCardOpen, setIsNavFeaturedCardOpen] = useState(true)
  const [helpModalStartTab, setHelpModalStartTab] = useState<number | null>(null)

  useEffect(() => {
    const handlePrintScreenClick = (e: KeyboardEvent) => {
      if (e.code === "PrintScreen") setIsNotification(true)
    }

    window.addEventListener("keyup", handlePrintScreenClick)

    return () => window.removeEventListener("keyup", handlePrintScreenClick)
  }, [])

  return (
    <GenerateContextProvider>
      <RestoreContextProvider>
        <>
          <HelpModal
            isActive={isHelpModalActive}
            setIsActive={setIsHelpModalActive}
            startTab={helpModalStartTab}
          />
          <Notification isActive={isNotification} setIsActive={setIsNotification} />
          <Detector
            render={({ online }) => (
              <Routes
                isOnline={online}
                setIsHelpModalActive={setIsHelpModalActive}
                setHelpModalStartTab={setHelpModalStartTab}
                isActive={isNavFeaturedCardOpen}
                setIsActive={setIsNavFeaturedCardOpen}
              />
            )}
          />
        </>
      </RestoreContextProvider>
    </GenerateContextProvider>
  )
}

export default App
