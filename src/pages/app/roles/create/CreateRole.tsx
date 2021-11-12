import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilLockLocked } from '@coreui/icons'

import { Card } from 'components'
import CreateRoleForm from './CreateRoleForm'

const CreateRole: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Card icon={cilLockLocked} title={t('actions.create')}>
      <CreateRoleForm />
    </Card>
  )
}

export default CreateRole
