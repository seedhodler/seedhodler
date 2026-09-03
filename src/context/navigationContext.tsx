import React, { createContext, Dispatch, SetStateAction, useState } from "react"

// The active tab (0 = Generate, 1 = Restore). Lifted out of HomePage so the
// sidebar (rendered by Layout, above HomePage) can show the checklist for the
// flow the user is actually in.
type NavigationContextType = {
  activeTabId: number
  setActiveTabId: Dispatch<SetStateAction<number>>
}

export const NavigationContext = createContext<NavigationContextType>({
  activeTabId: 0,
  setActiveTabId: () => {},
})

type ProviderProps = { children: JSX.Element }

export const NavigationContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [activeTabId, setActiveTabId] = useState(0)
  return (
    <NavigationContext.Provider value={{ activeTabId, setActiveTabId }}>
      {children}
    </NavigationContext.Provider>
  )
}
