import React from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorNotifier, SpinnerOverlay } from 'components'
import { DeviceWithServerFragment, useExperimentsQuery } from '__generated__/graphql'
import ExperimentForm from './ExperimentForm'

type Props = {
  device: DeviceWithServerFragment
}

const Experiment: React.FC<Props> = ({ device }: Props) => {
  const { t } = useTranslation()
  
  const { data, loading, error } = useExperimentsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      serverId: device.server.id,
      deviceId: device.id,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  if (!data?.experiments || !data?.experiments.length) return <ErrorNotifier error={t('experiments.no_experiments')} />

  return <ExperimentForm device={device} experiments={data.experiments} />
}

export default Experiment
