import React from "react"
import Select, { OnChangeValue, StylesConfig } from "react-select"

import variables from "src/styles/Variables.module.scss"

type Option = { label: string; value: string }

type Props = {
  defaultValue: string
  // When provided, the select is controlled: it always shows this value, so a
  // change the parent declines (e.g. behind a confirmation) snaps back on its own.
  value?: string
  options: Option[]
  onChange: (newValue: string) => void
  // "compact" is the small picker used for the split config (scheme / threshold /
  // share count): a narrow, taller control with a tidy menu (styled thin
  // scrollbar, no text entry) so the selectors read as a deliberate row.
  variant?: "default" | "compact"
  // Width of the compact control/menu; numbers fit 96, "SLIP-39" needs more.
  compactWidth?: number
}

// Neutral border for the resting control; the brand violet on hover/focus.
const borderColor = "#e1e1e1" // $colorBg400
const textColor = "#1a1d1f" // $colorTextDark

const makeCompactStyles = (width: number): StylesConfig<Option, false> => ({
  container: base => ({ ...base, width }),
  control: (base, state) => ({
    ...base,
    minHeight: 48,
    borderRadius: 12,
    borderColor: state.isFocused ? variables.colorMain : borderColor,
    boxShadow: "none",
    cursor: "pointer",
    "&:hover": { borderColor: variables.colorMain },
  }),
  valueContainer: base => ({ ...base, padding: "2px 14px" }),
  singleValue: base => ({ ...base, fontSize: 16, fontWeight: 600, color: textColor }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: base => ({ ...base, paddingLeft: 4, paddingRight: 8, color: "#9a9a9a" }),
  menu: base => ({ ...base, width, borderRadius: 12, overflow: "hidden" }),
  menuList: base => ({
    ...base,
    maxHeight: 258, // ~6 rows, then a slim scrollbar instead of the chunky default
    paddingTop: 4,
    paddingBottom: 4,
    "::-webkit-scrollbar": { width: 8 },
    "::-webkit-scrollbar-thumb": { background: "#d2d2d2", borderRadius: 8 },
    "::-webkit-scrollbar-track": { background: "transparent" },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: 15,
    fontWeight: 600,
    padding: "8px 14px",
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? variables.colorMain
      : state.isFocused
        ? variables.colorMainLight
        : "#fff",
    color: state.isSelected ? "#fff" : textColor,
    "&:active": { backgroundColor: variables.colorMainLight },
  }),
})

const CustomSelect: React.FC<Props> = ({
  defaultValue,
  value,
  options,
  onChange,
  variant,
  compactWidth = 96,
}) => {
  const controlled = value !== undefined ? { value: options.find(item => item.value === value) } : {}
  const isCompact = variant === "compact"
  return (
    <Select
      {...controlled}
      options={options}
      defaultValue={options.find(item => item.value === defaultValue)}
      isSearchable={!isCompact}
      styles={isCompact ? makeCompactStyles(compactWidth) : undefined}
      onChange={(selectedOption: OnChangeValue<Option, false>) =>
        onChange(selectedOption?.value as string)
      }
      theme={theme => ({
        ...theme,
        borderRadius: 12,
        colors: {
          ...theme.colors,
          primary: variables.colorMain,
          primary25: variables.colorMainLight,
        },
      })}
    />
  )
}

export default CustomSelect
