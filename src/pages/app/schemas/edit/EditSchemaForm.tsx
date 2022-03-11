import React, { useState } from 'react'
import {
  CButton,
  CCol,
  CForm,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilImage } from '@coreui/icons'

import {
  ArgumentInput,
  SchemaExtendedFragment,
  UpdateSchemaInput,
  useDeviceTypesAndSoftwareQuery,
  useUpdateSchemaMutation,
} from '__generated__/graphql'
import { ButtonSave, ErrorNotifier, ModalPreview, SpinnerOverlay } from 'components'
import { SchemaFormArguments } from '../components'

interface Props {
  schema: SchemaExtendedFragment
}

const formatSchemaInput = (schema: SchemaExtendedFragment) => {
  return {
    id: schema.id,
    name: schema.name,
    device_type_id: schema.deviceType.id,
    software_id: schema.software.id,
    note: schema.note,
    arguments: schema.arguments.map((argument) => {
      return {
        name: argument.name,
        label: argument.label,
        default_value: argument?.default_value,
        row: argument.row,
        order: argument.order,
        options: argument.options?.map((option) => {
          return {
            name: option?.name || '',
            value: option?.value || '0',
          }
        }),
      }
    }),
  }
}

const EditSchemaForm = ({ schema }: Props) => {
  const { t } = useTranslation()
  const [visiblePreview, setVisiblePreview] = useState(false)
  const deviceTypesAndSoftware = useDeviceTypesAndSoftwareQuery()
  const [updateSchemaInput, setUpdateSchemaInput] = useState<UpdateSchemaInput>(
    formatSchemaInput(schema),
  )
  const [editSchemaMutation, { loading, error }] = useUpdateSchemaMutation()

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault()

    await editSchemaMutation({
      variables: {
        updateSchemaInput,
      },
    })
      .then((data) => {
        if (data.data?.updateSchema) {
          toast.success(t('schemas.update.success'))
        }
      })
      .catch(() => {
        toast.error(t('schemas.update.error'))
      })
  }

  const handleDownloadSchema = () => {
    console.log('download', schema.schema)
    if (!schema.schema) {
      toast.error(t('schemas.download.error'))
      return
    }

    fetch(schema.schema)
      .then((response) => {
        response.blob().then((blob) => {
          const fileExt = schema.schema?.split('.').pop()
          const url = window.URL.createObjectURL(blob)
          let a = document.createElement('a')
          a.href = url
          a.download = `${schema.name}.${fileExt}`
          a.click()
          toast.success(t('schemas.download.success'))
        })
      })
      .catch((error) => {
        toast.error(t('schemas.download.error'))
        console.log(error, error.error)
      })
  }

  return (
    <>
      {schema.preview && (
        <ModalPreview
          active={visiblePreview}
          src={schema.preview}
          handleDismiss={() => {
            setVisiblePreview(false)
          }}
        />
      )}
      <CForm onSubmit={handleEdit}>
        {(loading || deviceTypesAndSoftware.loading) && <SpinnerOverlay transparent={true} />}
        {error && <ErrorNotifier error={error} />}
        {deviceTypesAndSoftware.error && <ErrorNotifier error={deviceTypesAndSoftware.error} />}

        <CFormFloating className="mb-3">
          <CFormInput
            type="text"
            id="name"
            value={updateSchemaInput.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setUpdateSchemaInput({ ...updateSchemaInput, name: event.target.value })
            }
          />
          <CFormLabel>{t('schemas.columns.name')}</CFormLabel>
        </CFormFloating>

        <CRow>
          <CCol sm={6}>
            <CFormLabel>{t('schemas.columns.device_type')}</CFormLabel>
            <CFormSelect
              className="mb-3"
              value={updateSchemaInput.device_type_id}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                event.preventDefault()
                setUpdateSchemaInput({ ...updateSchemaInput, device_type_id: event.target.value })
              }}
            >
              <option value="-1">select device type</option>
              {deviceTypesAndSoftware.data?.deviceTypes.map((deviceType) => (
                <option value={deviceType.id} key={deviceType.id}>
                  {deviceType.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol sm={6}>
            <CFormLabel>{t('schemas.columns.software')}</CFormLabel>
            <CFormSelect
              className="mb-3"
              value={updateSchemaInput.software_id}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                event.preventDefault()
                setUpdateSchemaInput({ ...updateSchemaInput, software_id: event.target.value })
              }}
            >
              <option value="-1">select software</option>
              {deviceTypesAndSoftware.data?.software.map((software) => (
                <option value={software.id} key={software.id}>
                  {software.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>

        <CFormFloating className="mb-3">
          <CFormTextarea
            id="note"
            value={updateSchemaInput.note || ''}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              setUpdateSchemaInput({ ...updateSchemaInput, note: event.target.value })
            }
            style={{ height: '6rem' }}
          ></CFormTextarea>
          <CFormLabel>{t('schemas.columns.note')}</CFormLabel>
        </CFormFloating>

        <CRow>
          <CCol md={6}>
            <CFormLabel>{t('schemas.columns.schema')}</CFormLabel>
            <div className="d-flex mb-3">
              <CFormInput
                type="file"
                id="schema"
                onChange={({ target: { validity, files } }) => {
                  if (validity.valid)
                    setUpdateSchemaInput({ ...updateSchemaInput, schema: files ? files[0] : null })
                }}
              />
              {schema.schema && (
                <CButton
                  color="success"
                  className="ms-2 d-inline-flex justify-content-center align-items-center text-light"
                  type="button"
                  onClick={handleDownloadSchema}
                >
                  <CIcon content={cilCloudDownload} />
                  <span className="ms-1">{schema.schema.split('/').pop()}</span>
                </CButton>
              )}
            </div>
          </CCol>
          <CCol md={6}>
            <CFormLabel>{t('schemas.columns.preview')}</CFormLabel>
            <div className="d-flex mb-3">
              <CFormInput
                type="file"
                id="preview"
                onChange={({ target: { validity, files } }) => {
                  if (validity.valid)
                    setUpdateSchemaInput({ ...updateSchemaInput, preview: files ? files[0] : null })
                }}
              />
              {schema.preview && (
                <CButton
                  color="warning"
                  className="ms-2 d-inline-flex justify-content-center align-items-center text-light"
                  type="button"
                  onClick={() => setVisiblePreview(true)}
                >
                  <CIcon content={cilImage} />
                </CButton>
              )}
            </div>
          </CCol>
        </CRow>

        <SchemaFormArguments
          schemaArguments={
            updateSchemaInput.arguments?.map((argument) => {
              return {
                name: argument.name,
                label: argument.label,
                default_value: argument?.default_value,
                row: argument.row,
                order: argument.order,
                options: argument.options?.map((option) => {
                  return {
                    name: option.name,
                    value: option.value,
                  }
                }),
              }
            }) as ArgumentInput[]
          }
          handleChange={(args) => setUpdateSchemaInput({ ...updateSchemaInput, arguments: args })}
        />

        <div className="text-right">
          <ButtonSave />
        </div>
      </CForm>
    </>
  )
}

export default EditSchemaForm
