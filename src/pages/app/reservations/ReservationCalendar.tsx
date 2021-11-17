import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import { DnDCalendar, SpinnerOverlay } from 'components'
import { Reservation } from 'types'
import { useCreateRoleMutation } from '__generated__/graphql'

interface Props {
  reservations: Reservation[]
}

const ReservationCalendar: React.FC<Props> = ({ reservations }: Props) => {
  const { t } = useTranslation()
  const [createRoleMutation, { loading }] = useCreateRoleMutation()

  // testing
  const handleCreateReservation = async (reservation: any) => {
    let response = false
    await createRoleMutation({
      variables: {
        createRoleInput: {
          name: reservation.title || '',
          permissions: ['1'],
        },
      },
    })
      .then((data: any) => {
        if (data.data?.createRole) {
          toast.success(t('reservations.create.success'))
          response = true
        }
      })
      .catch((error) => {
        console.log(error)
        toast.error('error')
      })

    return response
  }

  return (
    <>
      {loading && <SpinnerOverlay transparent={true} />}
      <DnDCalendar events={reservations} handleCreateEvent={handleCreateReservation} />
    </>
  )
}

export default ReservationCalendar
