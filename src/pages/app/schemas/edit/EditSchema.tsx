import React from 'react'
import { cilLockLocked } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useSchemaQuery } from '__generated__/graphql'
import { Card, ErrorNotifier, SpinnerOverlay } from 'components'
import EditSchemaForm from './EditSchemaForm'


const EditSchema: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const { data, loading, error } = useSchemaQuery({
    variables: {
      id,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />
  if (!data?.schema) return <div>404</div>

  return (
    <Card icon={cilLockLocked} title={t('actions.edit')}>
      <EditSchemaForm schema={data.schema} />
    </Card>
  )
}

export default EditSchema
