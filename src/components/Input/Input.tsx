import CSS from "csstype"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"


import classes from "./Input.module.scss"

type Props = {
  count?: number
  // Total number of words, used with count for the "Word 7 of 25" field label.
  total?: number
  index: number
  value: string
  onChange: Dispatch<SetStateAction<string[]>>
  onClick?: (index: number) => void
  onEnter: (index: number) => void
  wordlist: string[]
  isError?: boolean
  className?: string
  containerStyle?: CSS.Properties
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      count, total, index, value, onChange, onClick, onEnter,
      wordlist, isError, className, containerStyle
    },
    ref,
  ) => {

    const classNamesArr = [classes.input, className]
    if (isError) {
      classNamesArr.push(classes.error)
    }
    const classNames = classNamesArr.join(" ")
    const [focusedItemId, setFocusedItemId] = useState(0)
    const variants: string[] = []
    const isOpen = value.length !== 0 && !wordlist.some(word => word === value)
    let variantsCounter = 0

    for (let i = 0; i < wordlist.length; i++) {
      if (variantsCounter < 5) {
        if (wordlist[i].startsWith(value.toLowerCase())) {
          variantsCounter++
          variants.push(wordlist[i])
        }
      } else {
        break
      }
    }

    const handleChange = (newValue: string) => {
      onChange(mnemonicArr =>
        mnemonicArr.map((word, wordIndex) => (wordIndex === index ? newValue : word)),
      )
    }

    // Paste a whole list of words at once (the copy button produces CSV): each
    // comma, or any whitespace, advances to the next field, so the words fall
    // into consecutive fields from this one on, overwriting whatever was there.
    // A single word with no separators pastes normally (replaces the selection).
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData?.getData("text") ?? ""
      const parts = text
        .split(/[\s,]+/)
        .map(part => part.trim().toLowerCase())
        .filter(Boolean)
      if (parts.length <= 1) return
      e.preventDefault()
      onChange(mnemonicArr =>
        mnemonicArr.map((word, wordIndex) =>
          wordIndex >= index && wordIndex - index < parts.length ? parts[wordIndex - index] : word,
        ),
      )
      // Land focus on the field just after the last one filled (onEnter is a
      // no-op once there is no next field).
      onEnter(index + parts.length - 1)
    }

    // Clicking (or tabbing) into a filled field selects the whole word with the
    // caret at the start, so typing overwrites it straight away. The mouseup is
    // suppressed so the click does not collapse that selection into a caret.
    const selectWord = (el: HTMLInputElement) => {
      if (value) el.setSelectionRange(0, value.length, "backward")
    }
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => selectWord(e.currentTarget)
    const handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
      if (!value) return
      e.preventDefault()
      selectWord(e.currentTarget)
    }

    useEffect(() => {
      const onKeydown = (e: KeyboardEvent) => {
        if (isOpen) {
          if (e.key === "Tab" || e.key === "ArrowDown") {
            e.preventDefault()
            setFocusedItemId(prev => (focusedItemId < variants.length - 1 ? prev + 1 : 0))
          } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setFocusedItemId(prev => (focusedItemId <= 0 ? variants.length - 1 : prev - 1))
          } else if (e.key === "Enter" && variants.length > 0) {
            e.preventDefault()
            onChange(mnemonicArr =>
              mnemonicArr.map((word, wordIndex) =>
                wordIndex === index ? variants[focusedItemId] : word,
              ),
            )
            onEnter(index)
          }
        } else if (e.key === "Enter" && wordlist.some(word => word === value)) {
          onEnter(index)
        }
      }

      document.addEventListener("keydown", onKeydown)

      return () => document.removeEventListener("keydown", onKeydown)
    }, [focusedItemId, variants, isOpen, variants, index])

    useEffect(() => {
      setFocusedItemId(0)
    }, [value])

    return (
      <div
        onClick={() => (onClick ? onClick(index) : null)}
        className={classes.container}
        style={containerStyle}
      >
        {count && <span className={classes.count}>{count}</span>}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={e => handleChange(e.target.value)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          onMouseUp={handleMouseUp}
          className={classNames}
          aria-label={count && total ? `Word ${count} of ${total}` : undefined}
        />
        {isOpen && (
          <div className={classes.dropdownList}>
            {variants.length === 0 ? (
              <div className={classes.incorrectText}>Incorrect word</div>
            ) : (
              variants.map((variant, i) => (
                <button
                  onClick={() => handleChange(variant)}
                  key={variant}
                  className={`${classes.dropdownListItem} ${i === focusedItemId ? classes.focused : ""}`}
                  tabIndex={0}
                >
                  {variant}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    )
  },
)

export default Input
