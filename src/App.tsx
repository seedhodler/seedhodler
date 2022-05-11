import React, { useState, useEffect } from "react"

import Routes from "Routes"
import { ConnectionStatusModal } from "components/ConnectionStatusModal"

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [isModalActive, setIsModalActive] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    window.addEventListener("online", () => setIsOnline(true))
    window.addEventListener("offline", () => setIsOnline(false))

    return () => {
      window.removeEventListener("online", () => setIsOnline(true))
      window.removeEventListener("offline", () => setIsOnline(false))
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keyup", function (e) {
      // if (e.code === 44) {
      //   alert("The 'print screen' key is pressed")
      // }
      console.log(e.code, e.keyCode)
    })
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
