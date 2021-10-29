import React from 'react'
import { useParams } from 'react-router-dom'
import { useUserQuery } from '../../../../__generated__/graphql'
import EditUserForm from './EditUserForm'

const EditUser: React.FC = () => {
  const { id } = useParams()
  const { data, loading, error } = useUserQuery({
    variables: {
      id,
    },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!data?.user) return <div>404</div>

  return <EditUserForm user={data.user} />
}

export default EditUser
