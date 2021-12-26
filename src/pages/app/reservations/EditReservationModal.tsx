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
import DatePicker from 'react-datepicker'

import {
  DeviceWithReservationsFragment,
  UpdateReservationInput,
  useUpdateReservationMutation,
} from '__generated__/graphql'
import { ReservationWithDeviceId } from 'types'
import { formatDeviceName } from 'utils'
import { ButtonSave, ErrorNotifier, SpinnerOverlay } from 'components'

interface Props {
  devices: DeviceWithReservationsFragment[]
  selectedDevice: string
  visible: boolean
  reservation: ReservationWithDeviceId
  handleClose: () => void
  handleEditReservation: () => void
}

const EditReservationModal: React.FC<Props> = ({
  devices,
  visible,
  reservation,
  handleClose,
  handleEditReservation,
}: Props) => {
  const { t } = useTranslation()
  const [updateReservationMutation, { loading, error, reset }] = useUpdateReservationMutation()

  const [updateReservationInput, setUpdateReservationInput] = useState<UpdateReservationInput>({
    id: reservation.id,
    start: reservation.start,
    end: reservation.end,
  })

  useEffect(() => {
    setUpdateReservationInput({
      id: reservation.id,
      start: reservation.start,
      end: reservation.end,
    })
  }, [reservation])

  const handleCreateReservation = async (event: React.FormEvent) => {
    event.preventDefault()

    await updateReservationMutation({
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
          handleClose()
          handleEditReservation()
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
          <CModalTitle>{t('reservations.update.title')}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleCreateReservation}>
          <CModalBody>
            <ErrorNotifier error={error} />
            <CFormSelect
              className="mb-3 text-center"
              aria-label="device"
              value={reservation.device_id}
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
                selected={updateReservationInput.start}
                onChange={(date: Date) =>
                  setUpdateReservationInput({ ...updateReservationInput, start: date })
                }
                timeInputLabel="Time:"
                dateFormat="dd.MM.yyyy | HH:mm"
                showTimeInput
              />
              <span> - </span>
              <DatePicker
                selected={updateReservationInput.end}
                onChange={(date: Date) =>
                  setUpdateReservationInput({ ...updateReservationInput, end: date })
                }
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

export default EditReservationModal
