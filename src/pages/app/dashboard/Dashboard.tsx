import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card, ErrorNotifier, SpinnerOverlay } from 'components'
import { useReservationsCurrentQuery } from '__generated__/graphql'
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
      <Card title="Dashboard">
        <NoReservation />
      </Card>
    )

  return (
    <Card title={t('experiments.title')}>
      <Experiment device={reservation.device} />
    </Card>
  )
}

export default Dashboard
