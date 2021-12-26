import React, { useEffect, useState } from 'react'
import {
  CForm,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'

import {
  CreateReservationInput,
  DeviceWithReservationsFragment,
  UpdateReservationInput,
} from '__generated__/graphql'
import { formatDeviceName } from 'utils'
import { ButtonSave, ErrorNotifier } from 'components'
import { ApolloError } from '@apollo/client'

interface Props {
  devices: DeviceWithReservationsFragment[]
  selectedDevice: string
  visible: boolean
  reservation: CreateReservationInput | UpdateReservationInput
  handleSubmit: any
  handleClose: () => void
  error?: ApolloError
}

const ReservationModal: React.FC<Props> = ({
  devices,
  visible,
  reservation,
  selectedDevice,
  handleSubmit,
  handleClose,
  error,
}: Props) => {
  const { t } = useTranslation()

  const [reservationInput, setReservationInput] = useState<
    CreateReservationInput | UpdateReservationInput
  >({
    ...reservation,
    start: reservation.start,
    end: reservation.end,
  })

  useEffect(() => {
    setReservationInput({
      ...reservation,
      start: reservation.start,
      end: reservation.end,
    })
  }, [reservation])

  const handleCreateReservation = async (event: React.FormEvent) => {
    event.preventDefault()

    await handleSubmit(reservationInput)
      .then(handleClose)
      .catch(() => {})
  }

  return (
    <>
      <CModal visible={visible} alignment="center" onDismiss={handleClose}>
        <CModalHeader>
          <CModalTitle>{t('reservations.update.title')}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleCreateReservation}>
          <CModalBody>
            <ErrorNotifier error={error} />
            <CFormSelect
              className="mb-3 text-center"
              aria-label="device"
              value={selectedDevice}
              disabled
            >
              {devices.map((device) => (
                <option value={device.id} key={device.id} className="text-center">
                  {formatDeviceName(device)}
                </option>
              ))}
            </CFormSelect>
            <CFormLabel>Time range </CFormLabel>&nbsp;&nbsp;
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
              <DatePicker
                selected={reservationInput.start}
                onChange={(date: Date) => setReservationInput({ ...reservationInput, start: date })}
                timeInputLabel="Time:"
                dateFormat="dd.MM.yyyy | HH:mm"
                showTimeInput
              />
              <span> - </span>
              <DatePicker
                selected={reservationInput.end}
                onChange={(date: Date) => setReservationInput({ ...reservationInput, end: date })}
                timeInputLabel="Time:"
                dateFormat="dd.MM.yyyy | HH:mm"
                showTimeInput
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <ButtonSave />
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default ReservationModal
