import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CForm,
  CFormLabel,
  CFormSelect,
  CImage,
  CModal,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { useTranslation } from 'react-i18next'

import { ErrorNotifier, SpinnerOverlay } from 'components'
import {
  ArgumentBasicFragment,
  CreateUserExperimentInput,
  DeviceWithServerFragment,
  ExperimentBasicFragment,
  ExperimentSchemaFragment,
  useExperimentSchemasQuery,
} from '__generated__/graphql'
import ExperimentFormArgument from './ExperimentFormArgument'
import CIcon from '@coreui/icons-react'
import { cilImage } from '@coreui/icons'

type Props = {
  device: DeviceWithServerFragment
  experiments: ExperimentBasicFragment[]
}

interface ArugmentsRow {
  [key: number]: ArgumentBasicFragment[]
}

const formatSchemasArgument = (args: ArgumentBasicFragment[]) => {
  let formatted: ArugmentsRow = {}
  args.map((arg) => {
    if (!(arg.row in formatted)) formatted[arg.row] = []

    formatted[arg.row] = [...formatted[arg.row], arg]
  })

  Object.keys(formatted).forEach((key) => {
    const index = parseInt(key)
    formatted[index] = formatted[index].sort(
      (a: ArgumentBasicFragment, b: ArgumentBasicFragment) => a.order - b.order,
    )
  })

  return formatted
}

const ExperimentForm: React.FC<Props> = ({ device, experiments }: Props) => {
  const { t } = useTranslation()
  const [visiblePreview, setVisiblePreview] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentBasicFragment | undefined>(
    experiments[0],
  )
  const [selectedSchema, setSelectedSchema] = useState<ExperimentSchemaFragment | undefined>()

  // const [experimentInput, setExperimentInput] = useState<CreateUserExperimentInput>({
  //   //
  // })

  const { data, loading, error } = useExperimentSchemasQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      deviceTypeId: device.deviceType.id,
      softwareId: selectedExperiment?.software.id as string,
    },
  })

  useEffect(() => {
    setSelectedSchema(data?.schemas.length ? data.schemas[0] : undefined)
  }, [data])

  const handleCreate = () => {
    console.log('handle')
  }

  const getArguments = (args: ArgumentBasicFragment[]) => {
    const formatted = formatSchemasArgument(args)

    let rows: React.ReactNode[] = []

    Object.values(formatted).forEach((val: ArgumentBasicFragment[], rowIndex: number) => {
      let cols: React.ReactNode[] = []

      val.forEach((argument: ArgumentBasicFragment, colIndex: number) => {
        cols = [
          ...cols,
          <ExperimentFormArgument
            argument={argument}
            key={colIndex}
            handleChange={(value) => console.log(value)}
            className="mb-3 mx-1 flex-1"
          />,
        ]
      })

      rows = [
        ...rows,
        <div className="d-flex align-items-end" key={rowIndex}>
          {cols}
        </div>,
      ]
    })

    return rows
  }

  const schemas = data?.schemas

  return (
    <>
      <CModal
        visible={visiblePreview}
        alignment="center"
        size="xl"
        onDismiss={() => {
          setVisiblePreview(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>{t('schemas.preview.title')}</CModalTitle>
        </CModalHeader>
        {selectedSchema?.preview && <CImage className="m-2" fluid src={selectedSchema.preview} />}
      </CModal>
      <CForm onSubmit={handleCreate}>
        {loading && <SpinnerOverlay transparent={true} />}
        {error && <ErrorNotifier error={error} />}
        <CRow>
          <CCol sm={3}>
            <CFormLabel className="d-block">{t('experiments.columns.experiment')}</CFormLabel>
            <CFormSelect
              aria-label="experiment"
              id="experiment"
              className="mb-3"
              value={selectedExperiment?.id}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedExperiment(
                  experiments?.find((experiment: any) => experiment.id === event.target.value),
                )
              }}
            >
              {experiments.map((experiment: any) => (
                <option
                  value={experiment.id}
                  key={experiment.id}
                >{`${device.name} | ${experiment.software.name} `}</option>
              ))}
            </CFormSelect>

            {selectedExperiment?.has_schema && (
              <>
                <CFormLabel className="d-block">{t('experiments.columns.schema')}</CFormLabel>
                <div className="d-flex mb-3">
                  <CFormSelect
                    aria-label="schema"
                    id="schema"
                    value={selectedSchema?.id}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      setSelectedSchema(schemas?.find((schema) => schema.id === event.target.value))
                    }}
                  >
                    {schemas?.map((schema: ExperimentSchemaFragment) => (
                      <option value={schema.id} key={schema.id}>
                        {schema.name}
                      </option>
                    ))}
                  </CFormSelect>

                  <CButton
                    color="warning"
                    className="ms-2 d-inline-flex justify-content-center align-items-center"
                    onClick={() => setVisiblePreview(true)}
                  >
                    <CIcon content={cilImage} />
                  </CButton>
                </div>
              </>
            )}
          </CCol>

          <CCol sm={9}>{selectedSchema?.arguments && getArguments(selectedSchema?.arguments)}</CCol>
        </CRow>
        <div className="text-right">{/* <ButtonSave /> */}</div>
      </CForm>
    </>
  )
}

export default ExperimentForm
