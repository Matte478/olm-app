import React from 'react'
import { CFormSelect } from '@coreui/react'

interface Props {
  selected: number
  handleChange: (value: number) => void
}

const options = [1, 3, 5, 10]

const PerPageDropdown: React.FC<Props> = ({ selected, handleChange }: Props) => {
  return (
    <CFormSelect
      className="d-inline-block w-auto"
      aria-label="Per page"
      value={selected}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault()
        handleChange(parseInt(event.target.value))
      }}
    >
      {options.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </CFormSelect>
  )
}

export default PerPageDropdown
