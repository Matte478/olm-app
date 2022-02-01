import { CFormFloating, CFormInput, CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { ArgumentBasicFragment } from '__generated__/graphql'

type Props = {
  argument: ArgumentBasicFragment
  handleChange: (value: string) => void
  className?: string
}

const ExperimentFormArgument: React.FC<Props> = ({
  argument,
  handleChange,
  className = '',
}: Props) => {
  const [value, setValue] = useState<string>(argument?.default_value?.toString() || '')

  useEffect(() => {
    handleChange(value)
  }, [value])

  useEffect(() => {
    setValue(argument?.default_value?.toString() || '')
  }, [argument])

  return argument.options.length ? (
    <div className={className}>
      <CFormLabel className="d-block">{argument.label}</CFormLabel>
      <CFormSelect
        aria-label="schema"
        id="schema"
        value={value}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setValue(event.target.value)}
      >
        {argument.options.map((option) => (
          <option value={option?.value} key={option?.name}>
            {option?.name}
          </option>
        ))}
      </CFormSelect>
    </div>
  ) : (
    <CFormFloating className={className}>
      <CFormInput
        type="text"
        id={argument.name}
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
      />
      <CFormLabel>{argument.label}</CFormLabel>
    </CFormFloating>
  )
}

export default ExperimentFormArgument
