import CSS from "csstype"
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react"

import CloseIcon from "src/assets/icons/Close.svg"
import { BadgeTitle } from "src/components/BadgeTitle"
import { BadgeColorsEnum } from "src/constants/index"

import classes from "./Modal.module.scss"

type PropsBase = {
  badgeColor?: BadgeColorsEnum
  isActive: boolean
  isSuccess?: boolean
  isConfetti?: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
  children: JSX.Element
  style?: CSS.Properties
}
type Props = PropsBase &
  ({ title: string; isNotification?: false } | { title?: string; isNotification: true })

const Modal: React.FC<Props> = ({
  title,
  badgeColor = BadgeColorsEnum.SuccessLight,
  isActive,
  isSuccess,
  isConfetti,
  setIsActive,
  isNotification,
  children,
  style,
}) => {
  const modalHeaderRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const backdropSwitch = isSuccess ? classes.backdropSuccesActive : classes.backdropActive

  useEffect(() => {
    if (modalHeaderRef && isActive) {
      modalHeaderRef?.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [title, isActive])

  // Announce the dialog to assistive tech and trap the keyboard inside it while
  // open (audit 14): without this, Tab walked straight out of the open window
  // into the page behind. Move focus in on open, keep Tab cycling within, let
  // Escape close, and return focus to the trigger on close.
  useEffect(() => {
    if (isNotification || !isActive) return
    const trigger = document.activeElement as HTMLElement
    // Remember the trigger only when it is outside this dialog, so a re-run (e.g.
    // StrictMode double-invoke) does not capture the close button we just focused.
    if (!dialogRef.current?.contains(trigger)) lastFocusedRef.current = trigger
    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter(el => !el.hasAttribute("disabled") && el.offsetParent !== null)

    ;(focusables()[0] ?? dialogRef.current)?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsActive(false)
        return
      }
      if (e.key !== "Tab") return
      const list = focusables()
      if (list.length === 0) {
        e.preventDefault()
        return
      }
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      // Restore after the close commits, so React does not leave focus on the
      // now-hidden dialog.
      const trigger = lastFocusedRef.current
      requestAnimationFrame(() => trigger?.focus?.())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isNotification])

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isActive])

  return (
    <>
      {/* {isActive && isConfetti && (
        <Confetti
          style={{
            position: "fixed",
            top: 0,
            left: 0,
          }}
        />
      )} */}

      <div
        onClick={() => setIsActive(false)}
        className={isActive ? backdropSwitch : classes.backdrop}
        style={{ zIndex: isNotification ? 100 : "" }}
      >
        {!isNotification ? (
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
            className={isActive ? classes.modalActive : classes.modal}
            style={style}
          >
            <div className={classes.content}>
              {!isSuccess && (
                <div className={classes.modalHeader} ref={modalHeaderRef} id="modal-header">
                  <BadgeTitle title={title} color={badgeColor} headingLevel={2} style={{ marginBottom: 0 }} />
                  <button
                    onClick={() => setIsActive(false)}
                    className={classes.closeBtn}
                    aria-label="Close dialog"
                  >
                    <img src={CloseIcon} alt="" aria-hidden="true" />
                  </button>
                </div>
              )}
              {children}
            </div>
          </div>
        ) : (
          <div className={classes.notificationContainer}>{children}</div>
        )}
      </div>
    </>
  )
}

export default Modal
