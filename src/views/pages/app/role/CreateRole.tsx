import { cilLockLocked } from '@coreui/icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AppCard } from '../../../components'
import CreateRoleForm from './CreateRoleForm'

const CreateRole: React.FC = () => {
  const { t } = useTranslation()

  return (
    <AppCard icon={cilLockLocked} title={t('actions.create')}>
      <CreateRoleForm />
    </AppCard>
  )
}

export default CreateRole
