import React, { useContext, useEffect, useState } from 'react'
import { CButton, CFormSelect } from '@coreui/react'
import { Presets } from 'react-component-transition'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import moment, { Moment } from 'moment'
import { stringOrDate, View, Views } from 'react-big-calendar'
import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { RRule } from 'rrule'

import {
  CreateReservationInput,
  ReservationBasicFragment,
  UpdateReservationInput,
  useCreateReservationMutation,
  useDeleteReservationMutation,
  useUpdateReservationMutation,
} from '__generated__/graphql'
import { formatDeviceName } from 'utils'
import { DnDCalendar, SpinnerOverlay } from 'components'
import {
  DeviceWithReservationsExtended,
  PlaceholderReservation,
  ReservationWithDeviceId,
} from 'types'
import { AppStateContext } from 'provider'
import ReservationModal from './ReservationModal'
import { can } from 'utils/permissions'

interface Props {
  devices: DeviceWithReservationsExtended[]
  refetch: (variables?: Object) => Promise<any>
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

const isPlaceholder = (data: object) =>
  'title' in data && 'start' in data && 'end' in data && !('user' in data)

let dateRange: {
  from: Moment
  to: Moment
  view?: View
} = {
  from: moment().startOf('week'),
  to: moment().endOf('week'),
  view: Views.WEEK,
}

const ReservationCalendar: React.FC<Props> = ({ devices, refetch }: Props) => {
  const { appState } = useContext(AppStateContext)
  const { t } = useTranslation()

  const [selectedDevice, setSelectedDevice] = useState<string>()
  const [visibleCreateModal, setVisibleCreateModal] = useState(false)
  const [visibleEditModal, setVisibleEditModal] = useState(false)

  const [reservations, setReservations] =
    useState<(ReservationWithDeviceId | PlaceholderReservation)[]>()

  const hasCreatePermission = () =>
    can(['reservation.create_production', 'reservation.create_all'], appState.authUser)

  const hasUpdatePermission = (reservation: ReservationWithDeviceId) =>
    moment(reservation.start).isAfter() &&
    (can('reservation.update_all', appState.authUser) ||
      can('reservation.update_own', appState.authUser, (user) => user.id === reservation.user.id))

  const hasDeletePermission = (reservation: ReservationWithDeviceId) =>
    moment(reservation.start).isAfter() &&
    (can('reservation.delete_all', appState.authUser) ||
      can('reservation.delete_own', appState.authUser, (user) => user.id === reservation.user.id))

  useEffect(() => {
    if (!selectedDevice) return

    let reservations: (ReservationBasicFragment | PlaceholderReservation)[] = formatReservations(
      devices.find((device) => selectedDevice === device.id)?.reservations ?? [],
      selectedDevice,
    )

    if (dateRange.view !== Views.MONTH) {
      reservations = [...reservations, ...getPlaceholders()]
    }

    setReservations(reservations)
  }, [devices, selectedDevice])

  const [newReservationTime, setNewReservationTime] = useState<{
    start: Date
    end: Date
  }>()
  const [editReservation, setEditReservation] = useState<ReservationWithDeviceId>()

  const [createReservationMutation, createReservation] = useCreateReservationMutation()
  const [updateReservationMutation, updateReservation] = useUpdateReservationMutation()
  const [deleteReservationMutation, deleteReservation] = useDeleteReservationMutation()

  const getPlaceholders = () => {
    const rule = new RRule({
      freq: RRule.DAILY,
      dtstart: dateRange.from.toDate(),
      until: dateRange.to.toDate(),
    })
  
    return rule.all().map((date) => {
      return {
        title: t('reservations.maintenance'),
        start: moment(date).startOf('day').hours(4).toDate(),
        end: moment(date).startOf('day').hours(4).minutes(15).toDate(),
      }
    })
  }

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
          refetch()
          toast.success(t('reservations.create.success'))
          setVisibleCreateModal(false)
          // TODO: https://github.com/apollographql/apollo-client/pull/9210
          // createReservation.reset()
        }
      })
      .catch(() => {
        refetch()
        toast.error(t('reservations.create.error'))
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
          refetch()
          toast.success(t('reservations.update.success'))
          setVisibleEditModal(false)
          // updateReservation.reset()
        }
      })
      .catch(() => {
        refetch()
        toast.error(t('reservations.update.error'))
      })
  }

  const handleDeleteReservation = async (id: string) => {
    let response = window.confirm(t('reservations.delete.confirm'))
    if (response) {
      await deleteReservationMutation({
        variables: { id },
      })
        .then(() => {
          refetch()
          setVisibleEditModal(false)
          toast.success(t('reservations.delete.success'))
        })
        .catch(() => {})
    }
  }

  const handleInteractiveUpdate = (data: {
    start: stringOrDate
    end: stringOrDate
    event: Object
  }) => {
    if (!reservations) return
    if (!hasUpdatePermission(data.event as ReservationWithDeviceId)) return

    // TODO
    // setReservations(
    //   reservations.map((reservation) => {
    //     return reservation.id === (data.event as ReservationWithDeviceId).id
    //       ? { ...reservation, start: data.start, end: data.end }
    //       : reservation
    //   }),
    // )

    handleUpdateReservation({
      id: (data.event as ReservationWithDeviceId).id,
      start: data.start,
      end: data.end,
    })
  }

  const eventPropGetter = (event: Object) => {
    return {
      className: isPlaceholder(event)
        ? 'placeholder-event'
        : (event as ReservationWithDeviceId)?.user.id === appState.authUser?.id
        ? 'my-event'
        : 'general-event',
    }
  }

  return (
    <>
      {(createReservation.loading || updateReservation.loading || deleteReservation.loading) && (
        <SpinnerOverlay transparent={true} />
      )}

      {selectedDevice && (
        <ReservationModal
          title={t('reservations.create.title')}
          devices={devices}
          selectedDevice={selectedDevice}
          visible={visibleCreateModal}
          handleSubmit={handleCreateReservation}
          handleClose={() => {
            // createReservation.reset()
            setVisibleCreateModal(false)
          }}
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
          handleSubmit={handleUpdateReservation}
          handleClose={() => {
            // updateReservation.reset()
            setVisibleEditModal(false)
          }}
          reservation={{
            id: editReservation.id,
            start: editReservation.start,
            end: editReservation.end,
          }}
          error={updateReservation.error}
          additional={
            hasDeletePermission(editReservation) ? (
              <CButton
                className="d-inline-flex justify-content-center align-items-center text-light"
                color="danger"
                onClick={() => handleDeleteReservation(editReservation.id)}
              >
                <CIcon className="me-1" content={cilTrash} />
                {t('actions.delete')}
              </CButton>
            ) : (
              <></>
            )
          }
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
          <option value={device.id} key={device.id}>
            {!device.production
              ? `[ ${t('reservations.index.not_production').toUpperCase()} ] `
              : ''}
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
              if (!hasCreatePermission()) return

              setNewReservationTime({ start: new Date(start), end: new Date(end) })
              setVisibleCreateModal(true)
            }}
            handleSelectEvent={(event) => {
              if (isPlaceholder(event)) return

              const reservation = event as ReservationWithDeviceId
              if (!hasUpdatePermission(reservation)) return

              setEditReservation(reservation)
              setVisibleEditModal(true)
            }}
            handleEventDrop={(data) => {
              if (isPlaceholder(data)) return
              handleInteractiveUpdate(data)
            }}
            handleEventResize={(data) => {
              if (isPlaceholder(data)) return
              handleInteractiveUpdate(data)
            }}
            handleChangeTimeRange={(start, end, view) => {
              dateRange = { from: start, to: end, view }
              refetch({
                reservationStart: {
                  from: start.format('YYYY-MM-DD HH:mm:ss'),
                  to: end.format('YYYY-MM-DD HH:mm:ss'),
                },
              })
            }}
            draggableAccessor={(event) =>
              isPlaceholder(event) ? false : hasUpdatePermission(event as ReservationWithDeviceId)
            }
            eventPropGetter={eventPropGetter}
          />
        )}
      </Presets.TransitionFade>
    </>
  )
}

export default ReservationCalendar
