import React from "react"
import Select, { OnChangeValue } from "react-select"

import variables from "styles/Variables.module.scss"

type Props = {
  defaultValue: string
  options: { label: string; value: string }[]
  onChange: (newValue: string) => void
}

const CustomSelect: React.FC<Props> = ({ defaultValue, options, onChange }) => {
  return (
    <Select
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
