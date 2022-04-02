import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { cilUser } from '@coreui/icons'

import { Trashed, useUserQuery } from '__generated__/graphql'
import { Card, ErrorNotifier, SpinnerOverlay, Can } from 'components'
import EditUserForm from './EditUserForm'

const EditUser: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, loading, error } = useUserQuery({
    variables: {
      id,
      trashed: Trashed.With,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  if (!data?.user) return <div>404</div>

  return (
    <Can permission="user.update" notify={true}>
      <Card icon={cilUser} title={t('actions.edit')}>
        <EditUserForm user={data.user} handleUpdateUser={() => {
          navigate('/app/users/')
        }} />
      </Card>
    </Can>
  )
}

export default EditUser
