import { cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCol, CFormFloating, CFormInput, CFormLabel, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArgumentInput, OptionInput } from '__generated__/graphql'
import SchemaFormOptions from './SchemaFormOptions'

interface Props {
  argument: ArgumentInput
  handleDelete: () => void
  handleChange?: (argument: ArgumentInput) => void
}

const SchemaFormArgumentsRow: React.FC<Props> = ({
  argument,
  handleDelete,
  handleChange,
}: Props) => {
  const { t } = useTranslation()

  const [argumentInput, setArgumentInput] = useState<ArgumentInput>(argument)

  useEffect(() => {
    setArgumentInput(argument)
  }, [argument])

  useEffect(() => {
    if (handleChange) handleChange(argumentInput)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [argumentInput])

  const handleAddOption = () => {
    let options: OptionInput[] = argument?.options ? [...argument.options] : []

    options = [
      ...options,
      {
        name: '',
        value: '',
      },
    ]

    setArgumentInput({
      ...argumentInput,
      options,
    })
  }

  const handleChangeOption = (option: OptionInput, index: number) => {
    if (!argumentInput?.options) return

    const options = [
      ...argumentInput.options.slice(0, index),
      option,
      ...argumentInput.options.slice(index + 1),
    ]

    setArgumentInput({ ...argumentInput, options })
  }

  const handleDeleteOption = (index: number) => {
    if (!argumentInput?.options) return

    const options = [...argumentInput.options]
    options.splice(index, 1)
    setArgumentInput({ ...argumentInput, options })
  }

  return (
    <>
      <CRow className="mb-3">
        <CCol md={3}>
          <CFormFloating>
            <CFormInput
              type="text"
              id="argument_name"
              value={argumentInput.name}
              onChange={(event) => {
                setArgumentInput({ ...argumentInput, name: event.target.value })
              }}
            />
            <CFormLabel>{t('schemas.columns.argument.name')}</CFormLabel>
          </CFormFloating>
        </CCol>
        <CCol md={3}>
          <CFormFloating>
            <CFormInput
              type="text"
              id="label"
              value={argumentInput.label}
              onChange={(event) => {
                setArgumentInput({ ...argumentInput, label: event.target.value })
              }}
            />
            <CFormLabel>{t('schemas.columns.argument.label')}</CFormLabel>
          </CFormFloating>
        </CCol>
        <CCol md={3}>
          <CFormFloating>
            <CFormInput
              type="text"
              id="default_value"
              step="any"
              value={argumentInput?.default_value !== null ? argumentInput?.default_value : ''}
              onChange={(event) => {
                setArgumentInput({
                  ...argumentInput,
                  // eslint-disable-next-line
                  default_value: event.target.value.replace(/[^0-9\,.\]\[\s]/g, ''),
                })
              }}
            />
            <CFormLabel>{t('schemas.columns.argument.default_value')}</CFormLabel>
          </CFormFloating>
        </CCol>
        <CCol md={3} className="d-flex justify-content-start align-items-center">
          <CFormFloating className="me-3">
            <CFormInput
              type="number"
              id="row"
              value={argumentInput?.row || ''}
              onChange={(event) => {
                setArgumentInput({
                  ...argumentInput,
                  row: parseInt(event.target.value) || undefined,
                })
              }}
            />
            <CFormLabel>{t('schemas.columns.argument.row')}</CFormLabel>
          </CFormFloating>
          <CFormFloating className="me-3">
            <CFormInput
              type="number"
              id="order"
              value={argumentInput?.order || ''}
              onChange={(event) => {
                setArgumentInput({
                  ...argumentInput,
                  order: parseInt(event.target.value) || undefined,
                })
              }}
            />
            <CFormLabel>{t('schemas.columns.argument.order')}</CFormLabel>
          </CFormFloating>
          <CButton
            className="d-inline-flex justify-content-center align-items-center text-light"
            color="danger"
            onClick={handleDelete}
          >
            <CIcon className="me-1" content={cilTrash} />
          </CButton>
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <CCol md={{ span: 8, offset: 2 }}>
          {argument?.options?.length ? (
            <CCol xs={12} className="text-center">
              <h6>{t('schemas.options')}</h6>
            </CCol>
          ) : (
            <></>
          )}
          {argument?.options &&
            argument.options.map((option, index) => (
              <SchemaFormOptions
                option={option}
                handleChange={(option) => handleChangeOption(option, index)}
                handleDelete={() => handleDeleteOption(index)}
                key={index}
              />
            ))}
          <div className="text-center">
            <CButton
              className="d-inline-flex justify-content-center align-items-center text-light"
              onClick={handleAddOption}
            >
              <CIcon className="me-1" content={cilPlus} />
              {t('schemas.add_option')}
            </CButton>
          </div>
        </CCol>
      </CRow>
    </>
  )
}

export default SchemaFormArgumentsRow
