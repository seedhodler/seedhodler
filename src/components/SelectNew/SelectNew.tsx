import React from "react"
import Select from "react-select"

import variables from "styles/Variables.module.scss"

type Props = {
  options: { value: string; label: string }[]
  [x: string]: any
}

const SelectNew: React.FC<Props> = ({ options, ...restProps }) => {
  // TODO: provide types
  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isSelected ? "red" : "blue",
      padding: 20,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: 200,
    }),
    singleValue: (provided: any, state: any) => {
      const opacity = state.isDisabled ? 0.5 : 1
      const transition = "opacity 300ms"

      return { ...provided, opacity, transition }
    },
  }

  return (
    <Select
      options={options}
      defaultValue={options[0]}
      theme={theme => ({
        ...theme,
        borderRadius: 12,
        colors: {
          ...theme.colors,
          primary: variables.colorMain,
          primary25: variables.colorMainLight,
        },
      })}
      {...restProps}
    />
  )
}

export default SelectNew
