import React from 'react'
import { ErrorNotifier, SpinnerOverlay } from 'components'
import { DeviceWithServerFragment, useExperimentsQuery } from '__generated__/graphql'
import ExperimentForm from './ExperimentForm'

type Props = {
  device: DeviceWithServerFragment
}

const Experiment: React.FC<Props> = ({ device }: Props) => {
  const { data, loading, error } = useExperimentsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      serverId: device.server.id,
      deviceId: device.id,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  if (!data?.experiments) return <ErrorNotifier error="Device has no experiments" />

  return <ExperimentForm device={device} experiments={data.experiments} />
}

export default Experiment
