import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { cilCalendar } from '@coreui/icons'
import { Card, ErrorNotifier, SpinnerOverlay } from 'components'
import ReservationCalendar from './ReservationCalendar'

import {
  DeviceWithReservationsFragment,
  useDevicesQuery,
  useServersWithDevicesQuery,
} from '__generated__/graphql'
import { can } from 'utils/permissions'
import { AppStateContext } from 'provider'
import { DeviceWithReservationsExtended } from 'types'

const Reservation: React.FC = () => {
  const { appState } = useContext(AppStateContext)
  const { t } = useTranslation()

  const { data, loading, error, refetch } = useServersWithDevicesQuery({
    variables: {
      production: can('reservation.create_all', appState.authUser) ? undefined : true,
    },
  })

  console.log(appState.authUser?.permissionsList)

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />

  let devices: DeviceWithReservationsExtended[] = []

  if (data?.servers) {
    data.servers.forEach((server) => {
      devices = [
        ...devices,
        ...server.devices.map((device) => {
          return { ...device, production: server.production }
        }),
      ]
    })
  }

  return (
    <Card icon={cilCalendar} title={t('reservations.index.title')}>
      {devices && <ReservationCalendar devices={devices} refetch={refetch} />}
    </Card>
  )
}

export default Reservation
