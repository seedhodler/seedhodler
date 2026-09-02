import React from "react"
import Select, { OnChangeValue } from "react-select"

import variables from "src/styles/Variables.module.scss"

type Props = {
  defaultValue: string
  // When provided, the select is controlled: it always shows this value, so a
  // change the parent declines (e.g. behind a confirmation) snaps back on its own.
  value?: string
  options: { label: string; value: string }[]
  onChange: (newValue: string) => void
}

const CustomSelect: React.FC<Props> = ({ defaultValue, value, options, onChange }) => {
  const controlled = value !== undefined ? { value: options.find(item => item.value === value) } : {}
  return (
    <Select
      {...controlled}
      options={options}
      defaultValue={options.find(item => item.value === defaultValue)}
      onChange={(selectedOption: OnChangeValue<{ label: string; value: string }, false>) =>
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
