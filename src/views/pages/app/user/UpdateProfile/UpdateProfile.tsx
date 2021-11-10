import { cilUser } from '@coreui/icons'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { AppStateContext } from '../../../../../provider'
import { AppCard } from '../../../../components'
import UpdateProfileForm from './UpdateProfileForm'

const UpdateProfile: React.FC = () => {
  const { t } = useTranslation()
  const { appState, appSetAuthUser } = useContext(AppStateContext)

  return (
    <AppCard icon={cilUser} title={t('actions.edit')}>
      <UpdateProfileForm user={appState.authUser!} handleUpdateUser={appSetAuthUser} />
    </AppCard>
  )
}

export default UpdateProfile
