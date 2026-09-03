import React, { createContext, Dispatch, SetStateAction, useState } from "react"

import { helpChapters } from "src/constants"

const DEFAULT_TAB = helpChapters[0].id

type HelpModalType = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  tab: string
  setTab: Dispatch<SetStateAction<string>>
}

export const HelpModalContext = createContext<HelpModalType>({
  isOpen: false,
  setIsOpen: () => {},
  tab: DEFAULT_TAB,
  setTab: () => {},
})

export const HelpModalContextProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<string>(DEFAULT_TAB)

  return (
    <HelpModalContext.Provider value={{ isOpen, setIsOpen, tab, setTab }}>
      {children}
    </HelpModalContext.Provider>
  )
}
