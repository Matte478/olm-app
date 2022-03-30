import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilSpeedometer } from '@coreui/icons'

import { useReservationsCurrentQuery } from '__generated__/graphql'
import { Card, ErrorNotifier, SpinnerOverlay } from 'components'
import { Experiment, NoReservation } from './components'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const { data, loading, error } = useReservationsCurrentQuery({
    notifyOnNetworkStatusChange: true,
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />

  const reservation = data?.reservationsCurrent[0]

  if (!reservation)
    return (
      <Card title="Dashboard" icon={cilSpeedometer}>
        <NoReservation />
      </Card>
    )

  return (
    <Card title={t('experiments.title')} icon={cilSpeedometer}>
      <Experiment device={reservation.device} />
    </Card>
  )
}

export default Dashboard
