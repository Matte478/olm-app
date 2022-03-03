import React, { useState } from 'react'
import { CButton, CCol, CFormFloating, CFormInput, CFormLabel, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { OptionInput } from '__generated__/graphql'
import { useTranslation } from 'react-i18next'

interface Props {
  option: OptionInput
  handleChange: (option: OptionInput) => void
  handleDelete: () => void
}

const SchemaFormOptions: React.FC<Props> = ({ option, handleChange, handleDelete }: Props) => {
  const { t } = useTranslation()

  const [value, setValue] = useState<string>(option.value.toString())

  return (
    <CRow className="mb-3">
      <CCol xs={{ span: 4, offset: 2 }}>
        <CFormFloating>
          <CFormInput
            type="text"
            value={option.name}
            required
            onChange={(event) => {
              handleChange({ ...option, name: event.target.value })
            }}
          />
          <CFormLabel>{t('schemas.columns.argument.option.name')}</CFormLabel>
        </CFormFloating>
      </CCol>
      <CCol xs={4}>
        <CFormFloating>
          <CFormInput
            type="text"
            pattern="[a-zA-Z]"
            required
            value={value}
            onChange={(event) => {
              const val = event.target.value.replace(/[^0-9\,\]\[\s]/g, '')
              setValue(val)
              handleChange({ ...option, value: val })
            }}
          />
          <CFormLabel>{t('schemas.columns.argument.option.value')}</CFormLabel>
        </CFormFloating>
      </CCol>
      <CCol xs={2} className="d-flex justify-content-start align-items-center">
        <CButton
          className="d-inline-flex justify-content-center align-items-center text-light"
          color="danger"
          onClick={handleDelete}
        >
          <CIcon className="me-1" content={cilTrash} />
        </CButton>
      </CCol>
    </CRow>
  )
}

export default SchemaFormOptions
