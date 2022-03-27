import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import { cilLibraryAdd } from '@coreui/icons'

import { useExperimentsQuery, useQueueUserExperimentMutation } from '__generated__/graphql'
import { Card, ErrorNotifier, SpinnerOverlay } from 'components'
import { ExperimentFormInput } from 'types'
import { ExperimentForm } from '../components'

const Queue: React.FC = () => {
  const { t } = useTranslation()
  const [queueUserExperimentMutation, queueUserExperimentVariables] = useQueueUserExperimentMutation()

  const experimentsResponse = useExperimentsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      serverId: null,
      deviceId: null,
    },
  })

  const handleSubmit = async ({
    experimentId,
    schemaId,
    softwareId,
    command,
    experimentInput,
  }: ExperimentFormInput) => {
    await queueUserExperimentMutation({
      variables: {
        queueUserExperimentInput: {
          experiment_id: experimentId,
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
        if (data.data?.queueUserExperiment) {
          toast.success(t('queue.actions.run.success'))
        }
      })
      .catch(() => {
        toast.success(t('queue.actions.run.error'))
      })
  }

  if (experimentsResponse.loading) return <SpinnerOverlay transparent={true} />
  if (experimentsResponse.error) return <ErrorNotifier error={experimentsResponse.error} />
  if (!experimentsResponse.data?.experiments || !experimentsResponse.data?.experiments.length)
    return <ErrorNotifier error={t('queue.no_experiments')} />

  return (
    <Card title={t('queue.title')} icon={cilLibraryAdd}>
      <>
        {queueUserExperimentVariables.error && (
          <ErrorNotifier error={queueUserExperimentVariables.error} />
        )}
        {queueUserExperimentVariables.loading && <SpinnerOverlay transparent={true} />}
        <ExperimentForm
          experiments={experimentsResponse.data.experiments}
          handleSubmitForm={handleSubmit}
          submitBtnText={t('queue.actions.run.btn')}
          disableCommandSelect={true}
        />
      </>
    </Card>
  )
}

export default Queue
