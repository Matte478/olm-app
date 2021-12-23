import React, { useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import { Presets } from 'react-component-transition'

import 'rc-time-picker/assets/index.css'

import { Reservation } from 'types'
import { DnDCalendar } from 'components'
import CreateReservationModal from './CreateReservationModal'

interface Props {
  reservations: Reservation[]
  devices: any[]
  refetch: any
}

const formatDeviceName = (device: any) => {
  const availableSoftware = device.software.map((software: any) => software.name).join(', ')

  return `${device.name} - ${availableSoftware}`
}

const formatReservations = (reservations: any) =>
  reservations.map((reservation: any) => {
    return {
      ...reservation,
      start: new Date(reservation.start),
      end: new Date(reservation.end),
    }
  })

const ReservationCalendar: React.FC<Props> = ({ devices, refetch }: Props) => {
  const [visible, setVisible] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<string>()

  const [newReservationTime, setNewReservationTime] = useState<{
    start: Date
    end: Date
  }>()

  return (
    <>
      {selectedDevice && (
        <CreateReservationModal
          devices={devices}
          selectedDevice={selectedDevice}
          visible={visible}
          handleClose={() => setVisible(false)}
          reservationStart={newReservationTime?.start}
          reservationEnd={newReservationTime?.end}
          handleNewReservation={refetch}
        />
      )}

      <CFormSelect
        className="mb-3 text-center"
        aria-label="device"
        value={selectedDevice}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedDevice(event.target.value)
        }}
      >
        <option value="" key={-1} className="text-center">
          Select device
        </option>
        {devices.map((device) => (
          <option value={device.id} key={device.id} className="text-center">
            {formatDeviceName(device)}
          </option>
        ))}
      </CFormSelect>
      <Presets.TransitionFade>
        {selectedDevice && (
          <DnDCalendar
            height="calc(100vh - 240px)"
            events={formatReservations(
              devices.find((device) => selectedDevice === device.id).reservations,
            )}
            handleCreateEvent={({ start, end }) => {
              setNewReservationTime({ start, end })
              setVisible(true)
            }}
          />
        )}
      </Presets.TransitionFade>
    </>
  )
}

export default ReservationCalendar
