import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"

import { Button } from "src/components/Button"
import { Modal } from "src/components/Modal"
import { SchemeBadge } from "src/components/SchemeBadge"
import { BadgeColorsEnum } from "src/constants/index"
import { type Scheme } from "src/core"
import {
  buildForms,
  FORMS,
  type FormKey,
  type FormMeta,
  type FormSelection,
  matchingFormKeys,
} from "src/helpers"

import classes from "./PrintFormsModal.module.scss"

type Props = {
  isActive: boolean
  setIsActive: Dispatch<SetStateAction<boolean>>
  selectedWordCount: number
  selectedScheme: Scheme
  sharesNumber: number
  onPrinted?: () => void
  // When given, open with exactly these forms pre-selected instead of the full
  // set matching the split (used by the seed print icon to pre-select just the
  // seed form). The others stay available, only the initial ticks differ.
  initialSelection?: FormKey[]
}

const PrintFormsModal: React.FC<Props> = ({
  isActive,
  setIsActive,
  selectedWordCount,
  selectedScheme,
  sharesNumber,
  onPrinted,
  initialSelection,
}) => {
  const matching = useMemo(
    () => matchingFormKeys(selectedWordCount, selectedScheme),
    [selectedWordCount, selectedScheme],
  )
  const isMatch = (key: FormKey) => matching.includes(key)

  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [copies, setCopies] = useState<Record<string, number>>({})
  const [isBuilding, setIsBuilding] = useState(false)
  // The extra form groups start collapsed so a first-time user sees only the two
  // forms that fit their split, not the whole catalogue.
  const [showOther, setShowOther] = useState(false)
  const [showInserts, setShowInserts] = useState(false)
  // The form previewed in the right pane; follows the row under the cursor.
  const [hoveredKey, setHoveredKey] = useState<FormKey>(matching[0])

  // On open, pre-select exactly the forms matching the current split, default each
  // share form to one sheet per share, and reset the panes.
  useEffect(() => {
    if (!isActive) return
    setShowOther(false)
    setShowInserts(false)
    const preselect = initialSelection ?? matching
    setSelected(Object.fromEntries(FORMS.map(f => [f.key, preselect.includes(f.key)])))
    setHoveredKey(preselect[0] ?? matching[0])
    setCopies(
      Object.fromEntries(
        FORMS.filter(f => f.kind === "share" || f.kind === "insert").map(f => [
          f.key,
          f.kind === "share" || f.perEnvelope ? sharesNumber : 1,
        ]),
      ),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, matching, sharesNumber, initialSelection])

  const toggle = (key: FormKey) => setSelected(prev => ({ ...prev, [key]: !prev[key] }))
  const setCopy = (key: FormKey, n: number) =>
    setCopies(prev => ({ ...prev, [key]: Math.max(1, Math.min(16, n || 1)) }))

  const anySelected = FORMS.some(f => selected[f.key])

  // Print summary: how many sheets each selected form contributes (copies times
  // its page count) so the output is predictable before printing.
  const copiesOf = (f: FormMeta) =>
    f.kind === "share" || f.kind === "insert" ? copies[f.key] ?? 1 : 1
  const selectedForms = FORMS.filter(f => selected[f.key])
  const totalPages = selectedForms.reduce((n, f) => n + copiesOf(f) * (f.pages ?? 1), 0)

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
    onPrinted?.()
  }

  // Scheme/count badges for a seed or share form (used in the row and the preview
  // caption); inserts keep a plain text description instead.
  const formBadges = (form: FormMeta) => (
    <span className={classes.rowBadges}>
      {form.kind === "share" && form.scheme ? (
        <SchemeBadge scheme={form.scheme} small />
      ) : (
        <span className={`${classes.badge} ${classes.badgeBip39}`}>BIP-39</span>
      )}
      <span className={`${classes.badge} ${classes.badgeCount}`}>
        {form.detail.split(",")[0].trim()}
      </span>
    </span>
  )

  const row = (key: FormKey) => {
    const form = FORMS.find(f => f.key === key)!
    const isSel = !!selected[key]
    const hasCopies = form.kind === "share" || form.kind === "insert"
    return (
      <div
        key={key}
        className={`${classes.row} ${isSel ? classes.rowSelected : ""}`}
        onClick={() => toggle(key)}
        onMouseEnter={() => setHoveredKey(key)}
        role="checkbox"
        aria-checked={isSel}
        aria-label={`${form.label}, ${form.detail}`}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault()
            toggle(key)
          }
        }}
      >
        <input
          type="checkbox"
          className={classes.checkbox}
          checked={isSel}
          onChange={() => toggle(key)}
          onClick={e => e.stopPropagation()}
          tabIndex={-1}
        />
        {/* Small thumbnail: on narrow screens the right preview pane is hidden, so
            this keeps a preview at a glance. Hidden on wide (the pane covers it). */}
        <img src={form.preview} alt="" aria-hidden="true" className={classes.rowThumb} />
        <span className={classes.rowText}>
          <span className={classes.rowLabel}>{form.label}</span>
          {form.kind === "insert" ? (
            <span className={classes.rowDetail}>{form.detail}</span>
          ) : (
            // Seed and share forms: the same badges used elsewhere (scheme + count),
            // size-adjusted, instead of a text description.
            formBadges(form)
          )}
        </span>
        {hasCopies && isSel && (
          <span className={classes.copies} onClick={e => e.stopPropagation()}>
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
      </div>
    )
  }

  const matchKeys = FORMS.filter(f => isMatch(f.key)).map(f => f.key)
  const otherFormKeys = FORMS.filter(f => f.kind !== "insert" && !isMatch(f.key)).map(f => f.key)
  const insertKeys = FORMS.filter(f => f.kind === "insert").map(f => f.key)
  const hoveredForm = FORMS.find(f => f.key === hoveredKey)

  const disclosure = (open: boolean, onClick: () => void, label: string, hint?: string) => (
    <button type="button" className={classes.disclosure} onClick={onClick} aria-expanded={open}>
      <svg
        className={classes.disclosureChevron}
        data-open={open || undefined}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="9 6 15 12 9 18" />
      </svg>
      <span>
        {label}
        {hint && <span className={classes.disclosureHint}> {hint}</span>}
      </span>
    </button>
  )

  return (
    <Modal
      title="Print forms"
      isActive={isActive}
      setIsActive={setIsActive}
      badgeColor={BadgeColorsEnum.Main}
      style={{ height: "auto" }}
    >
      <div className={classes.body}>
        <p className={classes.intro}>
          <strong className={classes.introLead}>Blank forms only.</strong> You print the empty forms
          and fill in the words by hand, so the seed and shares never touch a file or the printer.
        </p>

        <div className={classes.layout}>
          <div className={classes.list}>
            {/* Each group is a lightly tinted block so its rows read as belonging
                together. The two extra groups are stacked disclosures with a
                stable label (only the chevron changes) to keep things calm. */}
            <div className={classes.groupBlock}>
              <p className={classes.groupTitle}>For your current split</p>
              <div className={classes.group}>{matchKeys.map(row)}</div>
            </div>

            <div className={classes.groupBlock}>
              {disclosure(
                showInserts,
                () => setShowInserts(v => !v),
                `Custody inserts (${insertKeys.length})`,
                "Optional storage and inheritance sheets",
              )}
              {showInserts && <div className={classes.group}>{insertKeys.map(row)}</div>}
            </div>

            <div className={classes.groupBlock}>
              {disclosure(
                showOther,
                () => setShowOther(v => !v),
                `Other formats (${otherFormKeys.length})`,
              )}
              {showOther && <div className={classes.group}>{otherFormKeys.map(row)}</div>}
            </div>
          </div>

          {/* Live preview of the form under the cursor; fills the space and shows
              what each form is. Hidden on narrow screens (row thumbnails stand in). */}
          <aside className={classes.previewPane}>
            {hoveredForm && (
              <>
                <img
                  src={hoveredForm.preview}
                  alt={`${hoveredForm.label} preview`}
                  className={classes.previewImg}
                />
                <div className={classes.previewCaption}>
                  <span className={classes.previewCaptionLabel}>{hoveredForm.label}</span>
                  {hoveredForm.kind === "insert" ? (
                    <span className={classes.previewCaptionDetail}>{hoveredForm.detail}</span>
                  ) : (
                    formBadges(hoveredForm)
                  )}
                </div>
              </>
            )}
          </aside>
        </div>

        <div className={classes.printAction}>
          {anySelected && (
            <p className={classes.summary}>
              <span className={classes.summaryTotal}>
                {totalPages} page{totalPages !== 1 ? "s" : ""} to print
              </span>
              <span className={classes.summaryBreakdown}>
                {selectedForms.map(f => `${copiesOf(f)}× ${f.label}`).join(" · ")}
              </span>
            </p>
          )}
          <Button onClick={handlePrint} disabled={!anySelected || isBuilding} fullWidth>
            {isBuilding ? "Preparing..." : "Print selected"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default PrintFormsModal
