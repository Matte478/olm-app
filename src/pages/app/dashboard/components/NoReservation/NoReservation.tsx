import React from 'react'
import { cilCalendar } from '@coreui/icons'
import { useTranslation } from 'react-i18next'

import { ButtonIcon, Can } from 'components'

const NoReservation: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <h6>You have no reservation</h6>
      {/* TODO: permissions */}
      <Can permission="server.create">
        {/* <ButtonAdd to="/app/servers/create" /> */}
        <ButtonIcon to="/app/reservations" icon={cilCalendar} text={t('actions.create')} />
      </Can>
    </>
  )
}

export default NoReservation
