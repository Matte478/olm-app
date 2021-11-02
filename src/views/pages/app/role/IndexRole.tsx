import React from 'react'
import { useRolesQuery } from '../../../../__generated__/graphql'
import { ErrorNotifier, SpinnerOverlay } from '../../../components'
import IndexRoleTable from './IndexRoleTable'

const IndexRole: React.FC = () => {
  const { data, loading, error, refetch } = useRolesQuery()

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  console.log(data!.roles)
  return <IndexRoleTable roles={data!.roles} refetch={refetch} />
}

export default IndexRole
