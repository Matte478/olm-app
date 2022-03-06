import React, { useCallback, useEffect, useState } from 'react'
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
import CIcon from '@coreui/icons-react'
import { cilImage } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'

import { ErrorNotifier, SpinnerOverlay } from 'components'
import {
  ArgumentBasicFragment,
  // CreateUserExperimentInput,
  DeviceWithServerFragment,
  ExperimentArgument,
  ExperimentBasicFragment,
  ExperimentSchemaFragment,
  useExperimentSchemasQuery,
  useRunUserExperimentMutation,
  UserExperimentArgInput,
  UserExperimentArgsInput,
  UserExperimentBasicFragment,
} from '__generated__/graphql'
import ExperimentFormArgument from './ExperimentFormArgument'
import ExperimentGraph from './ExperimentGraph'

type Props = {
  device: DeviceWithServerFragment
  experiments: ExperimentBasicFragment[]
}

interface ArugmentsRow {
  [key: number]: ArgumentBasicFragment[]
}

const formatSchemasArgument = (args: ArgumentBasicFragment[]) => {
  let formatted: ArugmentsRow = {}
  args.forEach((arg) => {
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

  const [userExperiment, setUserExperiment] = useState<UserExperimentBasicFragment>()

  const [visiblePreview, setVisiblePreview] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentBasicFragment | undefined>(
    experiments[0],
  )
  const [selectedSchema, setSelectedSchema] = useState<ExperimentSchemaFragment | undefined>()
  const [selectedCommand, setSelectedCommand] = useState<string | undefined>(
    experiments[0].commands[0] || undefined,
  )

  // const [experimentInput, setExperimentInput] = useState<CreateUserExperimentInput>({
  //   experiment_id: selectedExperiment?.id || '-1',
  //   input: [],
  //   sampling_rate: 0,
  //   simulation_time: 0,
  //   schema_id: selectedSchema?.id || undefined
  // })

  const [experimentInput, setExperimentInput] = useState<UserExperimentArgsInput>({
    script_name: selectedCommand || '',
    input: [],
  })

  const { data, loading, error } = useExperimentSchemasQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      deviceTypeId: device.deviceType.id,
      softwareId: selectedExperiment?.software.id as string,
    },
  })

  const [runUserExperimentMutation, runUserExperimentVariables] = useRunUserExperimentMutation()

  useEffect(() => {
    setSelectedSchema(data?.schemas.length ? data.schemas[0] : undefined)
  }, [data])

  useEffect(() => {
    replaceExperimentInput()
  }, [selectedExperiment, selectedSchema])

  const replaceExperimentInput = () => {
    setExperimentInput({
      ...experimentInput,
      input: [...getExperimentInput(), ...getSchemaInput()],
    })
  }

  const getExperimentInput = () => {
    return (
      selectedExperiment?.experiment_commands
        .find((command) => command?.name === selectedCommand)
        ?.arguments.map((arg) => {
          return {
            name: arg?.name as string,
            value: arg?.default_value || '',
          }
        }) || []
    )
  }

  const getSchemaInput = () => {
    return (
      selectedSchema?.arguments.map((arg) => {
        return {
          name: arg?.name as string,
          value: arg?.default_value?.toString() || '',
        }
      }) || []
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    console.log('handle', experimentInput, selectedSchema, selectedExperiment)

    if (
      !experimentInput ||
      !selectedExperiment ||
      (selectedExperiment?.has_schema && !selectedExperiment)
    )
      return

    await runUserExperimentMutation({
      variables: {
        runUserExperimentInput: {
          experiment_id: selectedExperiment.id,
          // sampling_rate: 200,
          // simulation_time: 500,
          schema_id: selectedSchema?.id,
          software_id: selectedExperiment.software.id,
          input: [experimentInput],
        },
      },
    })
      .then((data) => {
        if (data.data?.runUserExperiment) {
          toast.success(t('experiments.run.success'))
          // data.data.runUserExperiment.
          setUserExperiment(data.data.runUserExperiment)
        }
      })
      .catch(() => {})
  }

  const upsertArgument = useCallback((argument: UserExperimentArgInput) => {
    setExperimentInput((experimentInput) => {
      const i = experimentInput.input.findIndex((arg) => arg.name === argument.name)
      if (i > -1) experimentInput.input[i] = argument
      else experimentInput.input = [...experimentInput.input, argument]

      return { ...experimentInput, input: experimentInput.input }
    })
  }, [])

  const getArguments = (args: ArgumentBasicFragment[]) => {
    const formatted = formatSchemasArgument(args)

    let rows: React.ReactNode[] = []

    Object.values(formatted).forEach((val: ArgumentBasicFragment[], rowIndex: number) => {
      let cols: React.ReactNode[] = []

      val.forEach((argument: ArgumentBasicFragment, colIndex: number) => {
        cols = [
          ...cols,
          <CCol key={colIndex}>
            <ExperimentFormArgument
              argument={argument}
              val={experimentInput.input.find((arg) => arg.name === argument.name)?.value}
              handleChange={upsertArgument}
              className="mb-3"
              style={{ minWidth: '150px', maxWidth: '100%' }}
            />
          </CCol>,
        ]
      })

      rows = [
        ...rows,
        <CRow className="align-items-end" key={rowIndex}>
          {cols}
        </CRow>,
      ]
    })

    return rows
  }

  const schemas = data?.schemas

  return (
    <>
      {userExperiment && (
        <CRow>
          <CCol md={12}>{<ExperimentGraph userExperiment={userExperiment} />}</CCol>
          <hr className="my-4" />
        </CRow>
      )}
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
      <CForm onSubmit={handleSubmit}>
        {runUserExperimentVariables.error && (
          <ErrorNotifier error={runUserExperimentVariables.error} />
        )}
        {(loading || runUserExperimentVariables.loading) && <SpinnerOverlay transparent={true} />}
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
                const experiment = experiments?.find(
                  (experiment) => experiment.id === event.target.value,
                )
                setSelectedExperiment(experiment)
                setSelectedCommand(experiment?.commands[0] || undefined)
                setExperimentInput({
                  ...experimentInput,
                  script_name: experiment?.commands[0] || '',
                })
              }}
            >
              {experiments.map((experiment) => (
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

          <CCol sm={9}>
            <CFormLabel className="d-block">{t('experiments.columns.command')}</CFormLabel>
            <CFormSelect
              aria-label="experiment"
              id="experiment"
              className="mb-3"
              value={selectedCommand || undefined}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedCommand(event.target.value)
                setExperimentInput({ ...experimentInput, script_name: event.target.value })
              }}
            >
              {selectedExperiment?.commands.map((command) => (
                <option value={command as string} key={command}>
                  {command}
                </option>
              ))}
            </CFormSelect>
            <CRow>
              {selectedCommand &&
                selectedExperiment?.experiment_commands &&
                selectedExperiment?.experiment_commands
                  .find((command) => command?.name === selectedCommand)
                  ?.arguments.map((argument, index) => (
                    <CCol sm={6} md={6} key={index}>
                      <ExperimentFormArgument
                        argument={argument as ExperimentArgument}
                        val={
                          experimentInput.input.find((arg) => arg.name === argument?.name)?.value
                        }
                        handleChange={upsertArgument}
                        className="mb-3 flex-1"
                      />
                    </CCol>
                  ))}
            </CRow>
            {selectedSchema?.arguments && getArguments(selectedSchema?.arguments)}
          </CCol>
        </CRow>
        <div className="text-right">
          <CButton
            type="submit"
            className="d-inline-flex justify-content-center align-items-center"
            color="primary"
          >
            {t('experiments.actions.run')}
          </CButton>
        </div>
      </CForm>
    </>
  )
}

export default ExperimentForm
