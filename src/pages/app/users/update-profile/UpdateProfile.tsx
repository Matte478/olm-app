import { cilUser } from '@coreui/icons'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { AppStateContext } from 'provider'
import { Card } from 'components'
import UpdateProfileForm from './UpdateProfileForm'

const UpdateProfile: React.FC = () => {
  const { t } = useTranslation()
  const { appState, appSetAuthUser } = useContext(AppStateContext)

  return (
    <Card icon={cilUser} title={t('actions.edit')}>
      <UpdateProfileForm user={appState.authUser!} handleUpdateProfile={appSetAuthUser} />
    </Card>
  )
}

export default UpdateProfile
