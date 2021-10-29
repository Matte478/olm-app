import React from 'react'
import { useParams } from 'react-router-dom'
import { useUserQuery } from '../../../../__generated__/graphql'
import { ErrorNotifier, SpinnerOverlay } from '../../../components'
import EditUserForm from './EditUserForm'

const EditUser: React.FC = () => {
  const { id } = useParams()
  const { data, loading, error } = useUserQuery({
    variables: {
      id,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  if (!data?.user) return <div>404</div>

  return <EditUserForm user={data.user} />
}

export default EditUser
