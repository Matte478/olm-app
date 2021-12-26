import React, { useState } from 'react'
import { CFormSelect } from '@coreui/react'
import { Presets } from 'react-component-transition'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import moment from 'moment'

import {
  CreateReservationInput,
  DeviceWithReservationsFragment,
  UpdateReservationInput,
  useCreateReservationMutation,
  useUpdateReservationMutation,
} from '__generated__/graphql'
import { formatDeviceName } from 'utils'
import { DnDCalendar, SpinnerOverlay } from 'components'
import ReservationModal from './ReservationModal'
import { ReservationWithDeviceId } from 'types'

interface Props {
  devices: DeviceWithReservationsFragment[]
  refetch: () => void
}

const formatReservations = (reservations: any, deviceId: string) =>
  reservations.map((reservation: any) => {
    return {
      ...reservation,
      start: new Date(reservation.start),
      end: new Date(reservation.end),
      device_id: deviceId,
    }
  })

const ReservationCalendar: React.FC<Props> = ({ devices, refetch }: Props) => {
  const { t } = useTranslation()
  const [selectedDevice, setSelectedDevice] = useState<string>()
  const [visibleCreateModal, setVisibleCreateModal] = useState(false)
  const [visibleEditModal, setVisibleEditModal] = useState(false)

  const [newReservationTime, setNewReservationTime] = useState<{
    start: Date
    end: Date
  }>()
  const [editReservation, setEditReservation] = useState<ReservationWithDeviceId>()

  const [createReservationMutation, createReservation] = useCreateReservationMutation()
  const [updateReservationMutation, updateReservation] = useUpdateReservationMutation()

  const handleCreateSubmit = (createReservationInput: CreateReservationInput) => {
    return createReservationMutation({
      variables: {
        createReservationInput: {
          ...createReservationInput,
          start: moment(createReservationInput.start).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(createReservationInput.end).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    })
      .then((data) => {
        if (data.data?.createReservation) {
          toast.success(t('reservations.create.success'))
          refetch()
        }
      })
      .catch(() => {
        toast.error(t('reservations.create.error'))
        throw new Error()
      })
  }

  const handleUpdateSubmit = (updateReservationInput: UpdateReservationInput) => {
    return updateReservationMutation({
      variables: {
        updateReservationInput: {
          ...updateReservationInput,
          start: moment(updateReservationInput.start).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(updateReservationInput.end).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    })
      .then((data) => {
        if (data.data?.updateReservation) {
          toast.success(t('reservations.update.success'))
          refetch()
        }
      })
      .catch(() => {
        toast.error(t('reservations.update.error'))
        throw new Error()
      })
  }

  return (
    <>
      {(createReservation.loading || updateReservation.loading) && (
        <SpinnerOverlay transparent={true} />
      )}

      {selectedDevice && (
        <ReservationModal
          devices={devices}
          selectedDevice={selectedDevice}
          visible={visibleCreateModal}
          handleClose={() => {
            createReservation.reset()
            setVisibleCreateModal(false)
          }}
          handleSubmit={handleCreateSubmit}
          reservation={{
            device_id: selectedDevice,
            start: newReservationTime?.start || new Date(),
            end: newReservationTime?.end || new Date(),
          }}
          error={createReservation.error}
        />
      )}

      {editReservation && (
        <ReservationModal
          devices={devices}
          selectedDevice={editReservation.device_id}
          visible={visibleEditModal}
          handleClose={() => {
            setVisibleEditModal(false)
            updateReservation.reset()
          }}
          handleSubmit={handleUpdateSubmit}
          reservation={{
            id: editReservation.id,
            start: editReservation.start,
            end: editReservation.end,
          }}
          error={updateReservation.error}
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
          {t('reservations.columns.select_device')}
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
              devices.find((device) => selectedDevice === device.id)?.reservations,
              selectedDevice,
            )}
            handleCreateEvent={({ start, end }) => {
              setNewReservationTime({ start, end })
              setVisibleCreateModal(true)
            }}
            handleSelectEvent={(reservation) => {
              setEditReservation(reservation)
              console.log(reservation)
              setVisibleEditModal(true)
            }}
          />
        )}
      </Presets.TransitionFade>
    </>
  )
}

export default ReservationCalendar
