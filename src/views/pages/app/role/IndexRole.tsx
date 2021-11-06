import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilLockLocked } from '@coreui/icons'
import { useRolesQuery } from '../../../../__generated__/graphql'
import { AppCard, ButtonAdd, ErrorNotifier, SpinnerOverlay } from '../../../components'
import IndexRoleTable from './IndexRoleTable'

const IndexRole: React.FC = () => {
  const { t } = useTranslation()
  const { data, loading, error, refetch } = useRolesQuery()

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  console.log(data!.roles)
  return (
    <AppCard
      icon={cilLockLocked}
      title={t('roles.index.title')}
      aditional={<ButtonAdd to="/app/roles/create" />}
    >
      <IndexRoleTable roles={data!.roles} refetch={refetch} />
    </AppCard>
  )
}

export default IndexRole
