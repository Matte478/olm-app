import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { cilLan } from '@coreui/icons'

import { Card, ErrorNotifier, SpinnerOverlay } from 'components'
import { Trashed, useServerQuery } from '__generated__/graphql'
import EditServerForm from './EditServerForm'

const EditServer: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const { data, loading, error } = useServerQuery({
    variables: {
      id,
      trashedServer: Trashed.Without,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  if (!data?.server) return <div>404</div>

  return (
    <Card icon={cilLan} title={t('actions.edit')}>
      <EditServerForm server={data.server} />
    </Card>
  )
}

export default EditServer
