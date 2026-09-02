import { createContext } from "react"

// The live online/offline state, provided once from the Detector in App so any
// component can read it, not just Layout. The calm status pill and the loud
// "you are online while a secret is on screen" escalation both consume this.
export const OnlineStatusContext = createContext<boolean>(false)
