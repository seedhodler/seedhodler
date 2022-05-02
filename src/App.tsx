import React, { useState } from "react"

import { Modal } from "components/Modal"

import Routes from "Routes"

const App: React.FC = () => {
  const [isModalActive, setIsModalActive] = useState(true)

  return (
    <>
      <button onClick={() => setIsModalActive(true)} style={{ padding: "2rem" }}>
        Toggle modal
      </button>
      <Modal isActive={isModalActive} setIsActive={setIsModalActive}>
        <h2>Something</h2>
      </Modal>
      <Routes />
    </>
  )
}

export default App
