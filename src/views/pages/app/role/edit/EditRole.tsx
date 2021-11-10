import { cilLockLocked } from '@coreui/icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRoleQuery } from '../../../../../__generated__/graphql'
import { AppCard, ErrorNotifier, SpinnerOverlay } from '../../../../components'
import EditRoleForm from './EditRoleForm'

const EditRole: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const { data, loading, error } = useRoleQuery({
    variables: {
      id,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  if (!data?.role) return <div>404</div>

  return (
    <AppCard icon={cilLockLocked} title={t('actions.edit')}>
      <EditRoleForm role={data.role} />
    </AppCard>
  )
}

export default EditRole
