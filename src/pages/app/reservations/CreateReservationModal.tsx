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
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import { useCreateReservationMutation } from '__generated__/graphql'
import { ButtonSave, ErrorNotifier, SpinnerOverlay } from 'components'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  devices: any[]
  selectedDevice: string
  visible: boolean
  handleClose: () => void
  handleNewReservation: () => void

  reservationStart?: Date
  reservationEnd?: Date
}

const formatDeviceName = (device: any) => {
  const availableSoftware = device.software.map((software: any) => software.name).join(', ')

  return `${device.name} - ${availableSoftware}`
}

const CreateReservationModal: React.FC<Props> = ({
  devices,
  selectedDevice,
  visible,
  handleClose,
  handleNewReservation,
  reservationStart,
  reservationEnd,
}: Props) => {
  const { t } = useTranslation()
  const [createReservationMutation, { data, loading, error, reset }] =
    useCreateReservationMutation()

  const [start, setStart] = useState(reservationStart)
  const [end, setEnd] = useState(reservationEnd)

  useEffect(() => {
    setStart(reservationStart)
  }, [reservationStart])
  useEffect(() => {
    setEnd(reservationEnd)
  }, [reservationEnd])

  const handleCreateReservation = async (event: React.FormEvent) => {
    event.preventDefault()

    await createReservationMutation({
      variables: {
        createReservationInput: {
          device_id: selectedDevice,
          start: moment(start).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(end).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    })
      .then((data: any) => {
        if (data.data?.createReservation) {
          toast.success(t('reservations.create.success'))
          handleClose()
          handleNewReservation()
        }
      })
      .catch((error) => {
        toast.error(t('reservations.create.error'))
      })
  }

  return (
    <>
      {loading && <SpinnerOverlay transparent={true} />}

      <CModal
        visible={visible}
        alignment="center"
        onDismiss={() => {
          handleClose()
          reset()
        }}
      >
        <CModalHeader>
          <CModalTitle>Create reservation</CModalTitle>
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
              {devices.map((device: any) => (
                <option value={device.id} key={device.id} className="text-center">
                  {formatDeviceName(device)}
                </option>
              ))}
            </CFormSelect>
            <CFormLabel>Time range </CFormLabel>&nbsp;&nbsp;
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
              <DatePicker
                selected={start}
                onChange={(date: Date) => setStart(date)}
                timeInputLabel="Time:"
                dateFormat="dd.MM.yyyy | HH:mm"
                showTimeInput
                className="width-auto"
                // showTimeSelect
              />
              <span> - </span>
              <DatePicker
                selected={end}
                onChange={(date: Date) => setEnd(date)}
                timeInputLabel="Time:"
                dateFormat="dd.MM.yyyy | HH:mm"
                showTimeInput
                // showTimeSelect
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

export default CreateReservationModal
