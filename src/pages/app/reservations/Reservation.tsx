import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { cilCalendar } from '@coreui/icons'
import moment from 'moment'

import { useServersWithDevicesQuery } from '__generated__/graphql'
import { can } from 'utils/permissions'
import { AppStateContext } from 'provider'
import { DeviceWithReservationsExtended } from 'types'
import { Card, ErrorNotifier, SpinnerOverlay } from 'components'
import ReservationCalendar from './ReservationCalendar'

const Reservation: React.FC = () => {
  const { appState } = useContext(AppStateContext)
  const { t } = useTranslation()

  const { data, loading, error, refetch } = useServersWithDevicesQuery({
    variables: {
      production: can('reservation.create_all', appState.authUser) ? undefined : true,
      reservationStart: {
        from: moment().startOf('week').format('YYYY-MM-DD HH:mm:ss'),
        to: moment().endOf('week').format('YYYY-MM-DD HH:mm:ss'),
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  if (error) return <ErrorNotifier error={error} />

  let devices: DeviceWithReservationsExtended[] = []

  if (data?.servers) {
    data.servers.forEach((server) => {
      devices = [
        ...devices,
        ...server.devices.map((device) => {
          return {
            ...device,
            production: server.production,
          }
        }),
      ]
    })
  }

  return (
    <>
      {loading && <SpinnerOverlay transparent={true} />}
      <Card icon={cilCalendar} title={t('reservations.index.title')}>
        {devices && <ReservationCalendar devices={devices} refetch={refetch} />}
      </Card>
    </>
  )
}

export default Reservation
