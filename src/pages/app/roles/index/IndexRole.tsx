import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilLockLocked } from '@coreui/icons'

import { useRolesQuery } from '__generated__/graphql'
import { Card, ButtonAdd, ErrorNotifier, SpinnerOverlay, Can } from 'components'
import IndexRoleTable from './IndexRoleTable'

const IndexRole: React.FC = () => {
  const { t } = useTranslation()
  const { data, loading, error, refetch } = useRolesQuery()

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />

  return (
    <Card
      icon={cilLockLocked}
      title={t('roles.index.title')}
      actions={
        <Can permission="role.create">
          <ButtonAdd to="/app/roles/create" />
        </Can>
      }
    >
      <IndexRoleTable roles={data!.roles} refetch={refetch} />
    </Card>
  )
}

export default IndexRole
