import React from 'react'
import { cilLockLocked } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useRoleQuery } from '__generated__/graphql'
import { Card, ErrorNotifier, SpinnerOverlay } from 'components'
import EditRoleForm from './EditRoleForm'

const EditRole: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, loading, error } = useRoleQuery({
    variables: {
      id,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  if (!data?.role) return <div>404</div>

  return (
    <Card icon={cilLockLocked} title={t('actions.edit')}>
      <EditRoleForm role={data.role} handleUpdateRole={() => {
        navigate('/app/roles/')
      }} />
    </Card>
  )
}

export default EditRole
