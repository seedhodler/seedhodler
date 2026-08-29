import React, { useEffect, useState } from "react"

import { Detector } from "react-detect-offline"
import { HelpModal } from "src/components/HelpModal"
import { Notification } from "src/components/Notification"
import { GenerateContextProvider } from "src/context/generateContext"
import { HelpModalContextProvider } from "src/context/HelpModalContext"
import { RestoreContextProvider } from "src/context/restoreContext"
import Routes from "src/Routes"

const App: React.FC = () => {
  const [isNotification, setIsNotification] = useState(false)
  const [showWarningCard, setShowWarningCard] = useState(true)


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
        <HelpModalContextProvider>
          <>
            <HelpModal />
            <Notification isActive={isNotification} setIsActive={setIsNotification} />
            {/* polling={false} is deliberate. react-detect-offline polls
                https://httpbin.org/get every five seconds on Windows Chrome,
                Windows Firefox and Linux Chrome, which is most desktop users.
                A tool that tells people to disconnect must not itself report
                to a third party that they are on this page.

                Without polling the status comes from navigator.onLine, which
                errs towards "online" when a machine is on a network without
                internet. That is the safe direction: it shows the warning when
                in doubt, rather than hiding it. */}
            <Detector
              polling={false}
              render={({ online }) => (
                <Routes
                  isOnline={online}
                  showWarning={showWarningCard}
                  setShowWarning={setShowWarningCard}
                />
              )}
            />
          </>
        </HelpModalContextProvider>
      </RestoreContextProvider>
    </GenerateContextProvider>
  )
}

export default App
