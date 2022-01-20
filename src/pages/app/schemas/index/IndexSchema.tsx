import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilCalculator } from '@coreui/icons'

import { ButtonAdd, Can, Card, ErrorNotifier, SpinnerOverlay } from 'components'
import { useSchemasQuery } from '__generated__/graphql'
import IndexSchemaTable from './IndexSchemaTable'

const IndexSchema: React.FC = () => {
  const { t } = useTranslation()
  const { data, loading, error, refetch } = useSchemasQuery()

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />

  return (
    <Card
      icon={cilCalculator}
      title={t('schemas.index.title')}
      actions={
        <Can permission="schema.create">
          <ButtonAdd to="/app/schemas/create" />
        </Can>
      }
    >
      {data?.schemas && <IndexSchemaTable schemas={data.schemas} refetch={refetch} />}
    </Card>
  )
}

export default IndexSchema
