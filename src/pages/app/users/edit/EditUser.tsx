import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { cilUser } from '@coreui/icons'

import { useUserQuery } from '__generated__/graphql'
import { Card, ErrorNotifier, SpinnerOverlay, Can } from 'components'
import EditUserForm from './EditUserForm'

const EditUser: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { data, loading, error } = useUserQuery({
    variables: {
      id,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  if (!data?.user) return <div>404</div>

  return (
    <Can permission="user.update" notify={true}>
      <Card icon={cilUser} title={t('actions.edit')}>
        <EditUserForm user={data.user} />
      </Card>
    </Can>
  )
}

export default EditUser
