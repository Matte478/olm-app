import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilLockLocked } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

import { Card } from 'components'
import CreateRoleForm from './CreateRoleForm'

const CreateRole: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Card icon={cilLockLocked} title={t('actions.create')}>
      <CreateRoleForm handleCreateRole={() => {
        navigate('/app/roles/')
      }} />
    </Card>
  )
}

export default CreateRole
