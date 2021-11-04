import { cilUser } from '@coreui/icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useUserQuery } from '../../../../__generated__/graphql'
import { AppCard, ErrorNotifier, SpinnerOverlay } from '../../../components'
import EditUserForm from './EditUserForm'

const EditUser: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { data, loading, error } = useUserQuery({
    variables: {
      id,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  if (!data?.user) return <div>404</div>

  return (
    <AppCard icon={cilUser} title={t('actions.edit')}>
      <EditUserForm user={data.user} />
    </AppCard>
  )
}

export default EditUser
