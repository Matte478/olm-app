import React, { useCallback, useEffect, useState } from 'react'
import { CButton, CCol, CForm, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilImage } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'

import {
  ExperimentBasicFragment,
  ExperimentSchemaFragment,
  useExperimentSchemasQuery,
  UserExperimentArgInput,
  UserExperimentDashboardFragment,
} from '__generated__/graphql'
import { ErrorNotifier, ModalPreview, SpinnerOverlay } from 'components'
import { ArgumentBasic, ExperimentFormInput } from 'types'
import ExperimentFormArgument from './ExperimentFormArgument'

type Props = {
  experiments: ExperimentBasicFragment[]
  userExperimentCurrent?: UserExperimentDashboardFragment
  disableCommandSelect?: boolean
  handleSubmitForm: (input: ExperimentFormInput) => void
  submitBtnText?: string
  handleStop?: () => void
  disabled?: boolean
}

interface ArugmentsRow {
  [key: number]: ArgumentBasic[]
}

const formatArguments = (args: ArgumentBasic[]) => {
  let formatted: ArugmentsRow = {}
  args.forEach((arg) => {
    if (!(arg.row in formatted)) formatted[arg.row] = []

    formatted[arg.row] = [...formatted[arg.row], arg]
  })

  Object.keys(formatted).forEach((key) => {
    const index = parseInt(key)
    formatted[index] = formatted[index].sort(
      (a, b) => a.order - b.order,
    )
  })

  return formatted
}

const ExperimentForm: React.FC<Props> = ({
  experiments,
  userExperimentCurrent,
  disableCommandSelect = false,
  handleSubmitForm,
  submitBtnText,
  handleStop,
  disabled = false
}: Props) => {
  const { t } = useTranslation()

  const [visiblePreview, setVisiblePreview] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentBasicFragment | undefined>(
    experiments[0],
  )
  const [selectedSchema, setSelectedSchema] = useState<ExperimentSchemaFragment | undefined>()
  const [selectedCommand, setSelectedCommand] = useState<string | undefined>(
    experiments[0].commands[0] || undefined,
  )

  const [experimentInput, setExperimentInput] = useState<UserExperimentArgInput[]>([])

  const { data, loading, error } = useExperimentSchemasQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      deviceTypeId: (userExperimentCurrent?.experiment.device?.deviceType.id ||
        selectedExperiment?.deviceType.id) as string,
      softwareId:
        userExperimentCurrent?.experiment.software.id ||
        (selectedExperiment?.software.id as string),
    },
  })

  const getCommands = useCallback(
    (ue?: UserExperimentDashboardFragment) => {
      if (!ue && !userExperimentCurrent && selectedExperiment?.commands.includes('start'))
        return ['start']

      let experiment
      if (ue) {
        experiment = experiments.find((e) => e.id === ue.experiment.id)
      } else if (userExperimentCurrent) {
        experiment = experiments.find((e) => e.id === userExperimentCurrent.experiment.id)
      }

      if (experiment)
        return (
          experiment.commands.filter((command) => command !== 'start' && command !== 'stop') || []
        )

      return selectedExperiment?.commands || []
    },
    [experiments, userExperimentCurrent, selectedExperiment],
  )

  const setupSettings = useCallback(
    (userExperiment?: UserExperimentDashboardFragment) => {
      const experiment = userExperiment ? experiments?.find(
        (experiment) => experiment.id === userExperiment.experiment.id,
      ) : selectedExperiment ? selectedExperiment : experiments[0]

      setSelectedExperiment(experiment)

      const commands = getCommands(userExperiment)
      setSelectedCommand(commands[0] || undefined)

      setSelectedSchema(
        userExperiment
          ? userExperiment.schema || undefined
          : data?.schemas.length
            ? data.schemas[0]
            : undefined,
      )
    },
    [experiments, getCommands, selectedExperiment, data?.schemas],
  )

  const getExperimentInput = useCallback(() => {
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
  }, [selectedExperiment, selectedCommand])

  const getSchemaInput = useCallback(() => {
    return (
      selectedSchema?.arguments.map((arg) => {
        return {
          name: arg?.name as string,
          value: arg?.default_value?.toString() || '',
        }
      }) || []
    )
  }, [selectedSchema])

  useEffect(() => {
    setupSettings(userExperimentCurrent)
  }, [userExperimentCurrent, setupSettings])

  const replaceExperimentInput = useCallback(() => {
    setExperimentInput((oldInput) => [...getExperimentInput(), ...getSchemaInput()].map((input) => {
      return {
        ...input,
        value: oldInput.find(old => old.name === input.name)?.value ?? input.value
      }
    }))
  }, [getExperimentInput, getSchemaInput])

  useEffect(() => {
    replaceExperimentInput()
  }, [selectedExperiment, selectedSchema, replaceExperimentInput])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (
      !selectedCommand ||
      !experimentInput ||
      !selectedExperiment ||
      (selectedExperiment?.has_schema && !selectedExperiment)
    )
      return

    handleSubmitForm({
      experimentId: selectedExperiment.id,
      schemaId: selectedSchema?.id,
      softwareId: selectedExperiment.software.id,
      command: selectedCommand,
      experimentInput: experimentInput,
    })
  }

  const upsertArgument = useCallback((argument: UserExperimentArgInput) => {
    setExperimentInput((experimentInput) => {
      const i = experimentInput.findIndex((arg) => arg.name === argument.name)
      if (i > -1) experimentInput[i] = argument
      else experimentInput = [...experimentInput, argument]

      return experimentInput
    })
  }, [])

  const getArguments = (args: ArgumentBasic[]) => {
    const formatted = formatArguments(args)

    let rows: React.ReactNode[] = []

    Object.values(formatted).forEach((val: ArgumentBasic[], rowIndex: number) => {
      let cols: React.ReactNode[] = []

      val.forEach((argument: ArgumentBasic, colIndex: number) => {
        cols = [
          ...cols,
          <CCol key={colIndex}>
            <ExperimentFormArgument
              argument={argument}
              val={experimentInput.find((arg) => arg.name === argument.name)?.value}
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
      {selectedSchema?.preview && (
        <ModalPreview
          active={visiblePreview}
          src={selectedSchema.preview}
          handleDismiss={() => setVisiblePreview(false)}
        />
      )}
      <CForm onSubmit={handleSubmit}>
        {loading && <SpinnerOverlay transparent={true} />}
        {error && <ErrorNotifier error={error} />}
        <CRow>
          <CCol sm={3}>
            <CFormLabel className="d-block">{t('experiments.columns.experiment')}</CFormLabel>
            <CFormSelect
              aria-label="experiment"
              id="experiment"
              className="mb-3"
              disabled={!!userExperimentCurrent}
              value={selectedExperiment?.id}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                const experiment = experiments?.find(
                  (experiment) => experiment.id === event.target.value,
                )
                setSelectedExperiment(experiment)
                setSelectedCommand(experiment?.commands[0] || undefined)
              }}
            >
              {experiments.map((experiment) => (
                <option value={experiment.id} key={experiment.id}>
                  {experiment.name}
                </option>
              ))}
            </CFormSelect>

            {selectedExperiment?.has_schema && (
              <>
                <CFormLabel className="d-block">{t('experiments.columns.schema')}</CFormLabel>
                <div className="d-flex mb-3">
                  <CFormSelect
                    aria-label="schema"
                    id="schema"
                    disabled={!!userExperimentCurrent}
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
                    onClick={() => {
                      selectedSchema?.preview
                        ? setVisiblePreview(true)
                        : toast.error(t('schemas.preview.error'))
                    }}
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
              aria-label="command"
              id="command"
              className="mb-3"
              disabled={disableCommandSelect}
              value={selectedCommand || undefined}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedCommand(event.target.value)
              }}
            >
              {getCommands().map((command) => (
                <option value={command as string} key={command}>
                  {command}
                </option>
              ))}
            </CFormSelect>
            {selectedCommand && selectedExperiment?.experiment_commands && getArguments((selectedExperiment?.experiment_commands
              .find((command) => command?.name === selectedCommand)?.arguments || []))}
            {selectedSchema?.arguments && getArguments(selectedSchema?.arguments)}
          </CCol>
        </CRow>
        <div className="text-right">
          {handleStop && selectedExperiment?.commands.includes('stop') && (
            <CButton
              type="button"
              className="d-inline-flex justify-content-center align-items-center text-light me-2"
              color="danger"
              onClick={handleStop}
            >
              {t('experiments.actions.stop.btn')}
            </CButton>
          )}
          <CButton
            type="submit"
            className="d-inline-flex justify-content-center align-items-center"
            color="primary"
            disabled={disabled}
          >
            {submitBtnText ? submitBtnText : t('experiments.actions.run.btn')}
          </CButton>
        </div>
      </CForm>
    </>
  )
}

export default ExperimentForm
