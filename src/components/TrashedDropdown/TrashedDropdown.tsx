import React, { useState } from 'react'
import { CFormLabel, CFormSelect } from '@coreui/react'
import { Trashed } from '__generated__/graphql'
import { useTranslation } from 'react-i18next'

interface Props {
  initial?: Trashed
  handleChange: (value: Trashed) => void
}

const TrashedDropdown: React.FC<Props> = ({ initial = Trashed.Without, handleChange }: Props) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<Trashed>(initial)

  return (
    <>
      <CFormLabel className="me-2 mb-0">{t('trashed.label')}</CFormLabel>
      <CFormSelect
        className="d-inline-block w-auto"
        aria-label="Trashed"
        value={selected}
        id="trashed"
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          setSelected(event.target.value as Trashed)
          handleChange(event.target.value as Trashed)
        }}
      >
        <option value={Trashed.Without}>{t('trashed.without')}</option>
        <option value={Trashed.With}>{t('trashed.with')}</option>
        <option value={Trashed.Only}>{t('trashed.only')}</option>
      </CFormSelect>
    </>
  )
}

export default TrashedDropdown
