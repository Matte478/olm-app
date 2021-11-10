import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilLockLocked } from '@coreui/icons'
import { useRolesQuery } from '../../../../../__generated__/graphql'
import { AppCard, ButtonAdd, ErrorNotifier, SpinnerOverlay } from '../../../../components'
import IndexRoleTable from './IndexRoleTable'
import Can from '../../../../components/Can/Can'

const IndexRole: React.FC = () => {
  const { t } = useTranslation()
  const { data, loading, error, refetch } = useRolesQuery()

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />

  return (
    <AppCard
      icon={cilLockLocked}
      title={t('roles.index.title')}
      aditional={
        <Can permission="role.create">
          <ButtonAdd to="/app/roles/create" />
        </Can>
      }
    >
      <IndexRoleTable roles={data!.roles} refetch={refetch} />
    </AppCard>
  )
}

export default IndexRole
