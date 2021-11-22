import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilCalendar } from '@coreui/icons'
import { Card } from 'components'
import ReservationCalendar from './ReservationCalendar'

import eventsData from './events'

const Reservation: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Card icon={cilCalendar} title={t('reservation.index.title')}>
      <ReservationCalendar reservations={eventsData} />
    </Card>
  )
}

export default Reservation
