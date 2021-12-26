import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilCalendar } from '@coreui/icons'
import { Card, ErrorNotifier, SpinnerOverlay } from 'components'
import ReservationCalendar from './ReservationCalendar'

import { useDevicesQuery } from '__generated__/graphql'

const Reservation: React.FC = () => {
  const { t } = useTranslation()
  const { data, loading, error, refetch } = useDevicesQuery()

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />

  return (
    <Card icon={cilCalendar} title={t('reservations.index.title')}>
      {data?.devices && (
        <ReservationCalendar devices={data.devices} refetch={refetch} />
      )}
    </Card>
  )
}

export default Reservation
