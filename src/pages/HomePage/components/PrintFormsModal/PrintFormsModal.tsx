import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"

import { Button } from "src/components/Button"
import { Modal } from "src/components/Modal"
import { BadgeColorsEnum } from "src/constants/index"
import { type Scheme } from "src/core"
import { buildForms, FORMS, type FormKey, type FormSelection, matchingFormKeys } from "src/helpers"

import classes from "./PrintFormsModal.module.scss"

type Props = {
  isActive: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
  selectedWordCount: number
  selectedScheme: Scheme
  sharesNumber: number
}

const PrintFormsModal: React.FC<Props> = ({
  isActive,
  setIsActive,
  selectedWordCount,
  selectedScheme,
  sharesNumber,
}) => {
  const matching = useMemo(
    () => matchingFormKeys(selectedWordCount, selectedScheme),
    [selectedWordCount, selectedScheme],
  )
  const isMatch = (key: FormKey) => matching.includes(key)

  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [copies, setCopies] = useState<Record<string, number>>({})
  const [isBuilding, setIsBuilding] = useState(false)

  // On open, pre-select exactly the forms matching the current split and default
  // each share form to one sheet per share.
  useEffect(() => {
    if (!isActive) return
    setSelected(Object.fromEntries(FORMS.map(f => [f.key, isMatch(f.key)])))
    setCopies(
      Object.fromEntries(
        FORMS.filter(f => f.kind === "share" || f.kind === "insert").map(f => [
          f.key,
          f.kind === "share" || f.perEnvelope ? sharesNumber : 1,
        ]),
      ),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, matching, sharesNumber])

  const toggle = (key: FormKey) => setSelected(prev => ({ ...prev, [key]: !prev[key] }))
  const setCopy = (key: FormKey, n: number) =>
    setCopies(prev => ({ ...prev, [key]: Math.max(1, Math.min(16, n || 1)) }))

  const anySelected = FORMS.some(f => selected[f.key])

  const handlePrint = async () => {
    setIsBuilding(true)
    // Seed pages first, then share pages: FORMS is ordered that way, so keep it.
    const selection: FormSelection[] = FORMS.filter(f => selected[f.key]).map(f => ({
      key: f.key,
      copies: f.kind === "share" || f.kind === "insert" ? copies[f.key] ?? 1 : 1,
    }))
    const blob = await buildForms(selection)
    const fileUrl = URL.createObjectURL(blob)
    const docWindow = window.open(fileUrl, "PRINT", "height=720,width=1280")
    docWindow?.focus()
    docWindow?.print()
    setIsBuilding(false)
  }

  const row = (key: FormKey) => {
    const form = FORMS.find(f => f.key === key)!
    const match = isMatch(key)
    return (
      <label
        key={key}
        className={`${classes.row} ${match ? classes.rowMatch : classes.rowOther}`}
      >
        <input
          type="checkbox"
          className={classes.checkbox}
          checked={!!selected[key]}
          onChange={() => toggle(key)}
        />
        <span className={classes.rowText}>
          <span className={classes.rowLabel}>
            {form.label}
            {match && <span className={classes.matchBadge}>your split</span>}
          </span>
          <span className={classes.rowDetail}>{form.detail}</span>
        </span>
        {(form.kind === "share" || form.kind === "insert") && selected[key] && (
          <span className={classes.copies}>
            <span className={classes.copiesLabel}>copies</span>
            <input
              type="number"
              min={1}
              max={16}
              className={classes.copiesInput}
              value={copies[key] ?? 1}
              onChange={e => setCopy(key, parseInt(e.target.value, 10))}
            />
          </span>
        )}
      </label>
    )
  }

  const matchKeys = FORMS.filter(f => isMatch(f.key)).map(f => f.key)
  const otherFormKeys = FORMS.filter(f => f.kind !== "insert" && !isMatch(f.key)).map(f => f.key)
  const insertKeys = FORMS.filter(f => f.kind === "insert").map(f => f.key)

  return (
    <Modal
      title="Print forms"
      isActive={isActive}
      setIsActive={setIsActive}
      badgeColor={BadgeColorsEnum.SuccessLight}
      style={{ height: "auto" }}
    >
      <div className={classes.body}>
        <p className={classes.intro}>
          <strong className={classes.introLead}>Blank forms only.</strong> Your words are
          deliberately never written into the PDF or sent to the printer. You print the empty forms
          and fill in the words by hand, so the seed and shares never touch a file or a print job.
          The forms matching your current split are pre-selected; the others stay available but do
          not fit what you generated.
        </p>

        <p className={classes.groupTitle}>For your current split</p>
        <div className={classes.group}>{matchKeys.map(row)}</div>

        <p className={classes.groupTitle}>Other forms</p>
        <div className={classes.group}>{otherFormKeys.map(row)}</div>

        <p className={classes.groupTitle}>Custody inserts</p>
        <div className={classes.group}>{insertKeys.map(row)}</div>

        <Button onClick={handlePrint} disabled={!anySelected || isBuilding} fullWidth>
          {isBuilding ? "Preparing..." : "Print selected"}
        </Button>
      </div>
    </Modal>
  )
}

export default PrintFormsModal
