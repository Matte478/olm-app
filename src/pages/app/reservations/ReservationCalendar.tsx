import React, { useContext, useEffect, useState } from 'react'
import { CFormSelect } from '@coreui/react'
import { Presets } from 'react-component-transition'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import moment from 'moment'

import {
  CreateReservationInput,
  DeviceWithReservationsFragment,
  ReservationBasicFragment,
  UpdateReservationInput,
  useCreateReservationMutation,
  useUpdateReservationMutation,
} from '__generated__/graphql'
import { formatDeviceName } from 'utils'
import { DnDCalendar, SpinnerOverlay } from 'components'
import { ReservationWithDeviceId } from 'types'
import { AppStateContext } from 'provider'
import ReservationModal from './ReservationModal'
import { stringOrDate } from 'react-big-calendar'

interface Props {
  devices: DeviceWithReservationsFragment[]
  refetch: () => void
}

const formatReservations = (reservations: ReservationBasicFragment[], deviceId: string) =>
  reservations.map((reservation) => {
    return {
      ...reservation,
      start: new Date(reservation.start),
      end: new Date(reservation.end),
      device_id: deviceId,
    }
  })

const ReservationCalendar: React.FC<Props> = ({ devices, refetch }: Props) => {
  const { appState } = useContext(AppStateContext)
  const { t } = useTranslation()

  const [selectedDevice, setSelectedDevice] = useState<string>()
  const [visibleCreateModal, setVisibleCreateModal] = useState(false)
  const [visibleEditModal, setVisibleEditModal] = useState(false)

  const [reservations, setReservations] = useState<ReservationWithDeviceId[]>()

  useEffect(() => {
    if (!selectedDevice) return
    setReservations(
      formatReservations(
        devices.find((device) => selectedDevice === device.id)?.reservations ?? [],
        selectedDevice,
      ),
    )
  }, [devices, selectedDevice])

  const [newReservationTime, setNewReservationTime] = useState<{
    start: Date
    end: Date
  }>()
  const [editReservation, setEditReservation] = useState<ReservationWithDeviceId>()

  const [createReservationMutation, createReservation] = useCreateReservationMutation()
  const [updateReservationMutation, updateReservation] = useUpdateReservationMutation()

  const handleCreateReservation = (createReservationInput: CreateReservationInput) => {
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
        refetch()
        // throw new Error()
      })
  }

  const handleUpdateReservation = (updateReservationInput: UpdateReservationInput) => {
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
        refetch()
        // throw new Error()
      })
  }

  const handleInteractiveUpdate = (data: {
    start: stringOrDate
    end: stringOrDate
    event: Object
  }) => {
    if (!reservations) return

    setReservations(
      reservations.map((reservation) => {
        return reservation.id === (data.event as ReservationWithDeviceId).id
          ? { ...reservation, start: data.start, end: data.end }
          : reservation
      }),
    )

    handleUpdateReservation({
      id: (data.event as ReservationWithDeviceId).id,
      start: data.start,
      end: data.end,
    })
  }

  const eventPropGetter = (event: ReservationWithDeviceId) => {
    return {
      className: event?.user.id === appState.authUser?.id ? 'my-event' : 'general-event',
    }
  }

  return (
    <>
      {(createReservation.loading || updateReservation.loading) && (
        <SpinnerOverlay transparent={true} />
      )}

      {selectedDevice && (
        <ReservationModal
          title={t('reservations.create.title')}
          devices={devices}
          selectedDevice={selectedDevice}
          visible={visibleCreateModal}
          handleClose={() => {
            createReservation.reset()
            setVisibleCreateModal(false)
          }}
          handleSubmit={handleCreateReservation}
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
          title={t('reservations.update.title')}
          devices={devices}
          selectedDevice={editReservation.device_id}
          visible={visibleEditModal}
          handleClose={() => {
            setVisibleEditModal(false)
            updateReservation.reset()
          }}
          handleSubmit={handleUpdateReservation}
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
        {reservations && (
          <DnDCalendar
            height="calc(100vh - 240px)"
            events={reservations}
            handleSelectSlot={({ start, end }) => {
              setNewReservationTime({ start: new Date(start), end: new Date(end) })
              setVisibleCreateModal(true)
            }}
            handleSelectEvent={(reservation) => {
              setEditReservation(reservation as ReservationWithDeviceId)
              setVisibleEditModal(true)
            }}
            handleEventDrop={handleInteractiveUpdate}
            handleEventResize={handleInteractiveUpdate}
            eventPropGetter={(event) => eventPropGetter(event as ReservationWithDeviceId)}
          />
        )}
      </Presets.TransitionFade>
    </>
  )
}

export default ReservationCalendar
