import React, { useState } from 'react'
import { CCol, CRow } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'

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
  const [runUserExperimentMutation, runUserExperimentVariables] = useRunUserExperimentMutation()
  const [userExperiment, setUserExperiment] = useState<UserExperimentDashboardFragment | undefined>(
    userExperimentCurrent,
  )

  const handleSubmit = async ({
    experimentId,
    schemaId,
    softwareId,
    command,
    experimentInput,
  }: ExperimentFormInput) => {
    await runUserExperimentMutation({
      variables: {
        runUserExperimentInput: {
          experiment_id: experimentId,
          user_experiment_id: userExperiment?.id,
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
        toast.error(t('experiments.actions.run.error'))
      })
  }

  const stopExperiment = async () => {
    if (!userExperiment) return

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
          setUserExperiment(undefined)
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
          <CCol md={12}>{<ExperimentVisualization userExperiment={userExperiment} />}</CCol>
          <hr className="my-4" />
        </CRow>
      )}
      <ExperimentForm
        experiments={experiments}
        userExperimentCurrent={userExperiment}
        handleSubmitForm={handleSubmit}
        handleStop={userExperiment ? stopExperiment : undefined}
      />
    </>
  )
}

export default ExperimentFormWrapper
