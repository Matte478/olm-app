import React from 'react'
import { cilCalendar } from '@coreui/icons'
import { useTranslation } from 'react-i18next'

import { ButtonIcon, Can } from 'components'

const NoReservation: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="text-center">
      <h5 className="mb-3">{t('experiments.no_reservation')}</h5>
      <Can permission={['reservation.create_production', 'reservation.create_all']}>
        <ButtonIcon
          to="/app/reservations"
          icon={cilCalendar}
          text={t('experiments.create_reservation')}
        />
      </Can>
    </div>
  )
}

export default NoReservation
