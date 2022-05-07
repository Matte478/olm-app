import React, { useEffect, useState } from 'react'
import { CCol, CRow } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import { FormProvider, useForm } from 'react-hook-form'
import { PlotData } from 'plotly.js'

import {
  ExperimentBasicFragment,
  UserExperimentDashboardFragment,
  useRunUserExperimentMutation,
} from '__generated__/graphql'
import { ErrorNotifier, SpinnerOverlay } from 'components'
import ExperimentVisualization from './ExperimentVisualization'
import { ExperimentForm } from 'pages/app/experiment/components'
import { ExperimentFormInput } from 'types'

type Props = {
  experiments: ExperimentBasicFragment[]
  userExperimentCurrent?: UserExperimentDashboardFragment
}

const ExperimentFormWrapper: React.FC<Props> = ({ experiments, userExperimentCurrent }: Props) => {
  const { t } = useTranslation()
  const form = useForm<PlotData[]>()
  const [running, setRunning] = useState(false)
  const [disabledForm, setDisabledForm] = useState(false)
  const [runUserExperimentMutation, runUserExperimentVariables] = useRunUserExperimentMutation()
  const [userExperiment, setUserExperiment] = useState<UserExperimentDashboardFragment | undefined>(
    userExperimentCurrent,
  )

  useEffect(() => {
    if (running) setDisabledForm(false)
  }, [running])

  const handleSubmit = async ({
    experimentId,
    schemaId,
    softwareId,
    command,
    experimentInput,
  }: ExperimentFormInput) => {
    if (command === 'start') setDisabledForm(true)
    await runUserExperimentMutation({
      variables: {
        runUserExperimentInput: {
          experiment_id: experimentId,
          user_experiment_id: running ? userExperiment?.id : undefined,
          schema_id: schemaId,
          software_id: softwareId,
          input: [
            {
              script_name: command,
              input: experimentInput,
            },
          ],
        },
      },
    })
      .then((data) => {
        if (data.data?.runUserExperiment) {
          toast.success(t('experiments.actions.run.success'))
          setUserExperiment(data.data.runUserExperiment)
        }
      })
      .catch(() => {
        setDisabledForm(false)
        toast.error(t('experiments.actions.run.error'))
      })
  }

  const stopExperiment = async () => {
    if (!userExperiment || !running) return

    await runUserExperimentMutation({
      variables: {
        runUserExperimentInput: {
          experiment_id: userExperiment.experiment.id,
          user_experiment_id: userExperiment.id,
          software_id: userExperiment.experiment.software.id,
          input: [
            {
              script_name: 'stop',
              input: [],
            },
          ],
        },
      },
    })
      .then((data) => {
        if (data.data?.runUserExperiment) {
          toast.success(t('experiments.actions.stop.success'))
          // setUserExperiment(undefined)
        }
      })
      .catch(() => {
        toast.error(t('experiments.actions.stop.error'))
      })
  }

  return (
    <>
      {runUserExperimentVariables.error && (
        <ErrorNotifier error={runUserExperimentVariables.error} />
      )}

      {runUserExperimentVariables.loading && <SpinnerOverlay transparent={true} />}
      {userExperiment && (
        <CRow>
          <CCol md={12}>{
            <FormProvider {...form}>
              <ExperimentVisualization userExperiment={userExperiment} running={running} setRunning={setRunning} />
            </FormProvider>
          }</CCol>
          <hr className="my-4" />
        </CRow>
      )}
      <ExperimentForm
        experiments={experiments}
        userExperimentCurrent={running ? userExperiment : undefined}
        handleSubmitForm={handleSubmit}
        handleStop={userExperiment && running ? stopExperiment : undefined}
        disabled={disabledForm}
      />
    </>
  )
}

export default ExperimentFormWrapper
