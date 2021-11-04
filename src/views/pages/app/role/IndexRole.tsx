import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilLockLocked, cilPlus } from '@coreui/icons'
import { useRolesQuery } from '../../../../__generated__/graphql'
import { AppCard, ErrorNotifier, SpinnerOverlay } from '../../../components'
import IndexRoleTable from './IndexRoleTable'
import { Link } from 'react-router-dom'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'

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
      aditional={
        <Link to="/app/roles/create">
          <CButton className="text-center">
            <CIcon content={cilPlus} />
          </CButton>
        </Link>
      }
    >
      <IndexRoleTable roles={data!.roles} refetch={refetch} />
    </AppCard>
  )
}

export default IndexRole
