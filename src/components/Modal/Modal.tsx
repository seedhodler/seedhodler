import React, { Dispatch, SetStateAction } from "react"

import classes from "./Modal.module.scss"

type Props = {
  isActive: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
  children: JSX.Element
}

const Modal: React.FC<Props> = ({ isActive, setIsActive, children }) => {
  return (
    <div onClick={() => setIsActive(false)} className={isActive ? classes.backdropActive : classes.backdrop}>
      <div onClick={e => e.stopPropagation()} className={isActive ? classes.contentActive : classes.content}>
        {children}
      </div>
    </div>
  )
}

export default Modal
