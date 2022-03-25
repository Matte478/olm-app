import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cilCalculator } from '@coreui/icons'

import { ButtonAdd, Can, Card, ErrorNotifier, SpinnerOverlay, TrashedDropdown } from 'components'
import { SchemaBasicFragment, Trashed, useSchemasQuery } from '__generated__/graphql'
import IndexSchemaTable from './IndexSchemaTable'

const IndexSchema: React.FC = () => {
  const { t } = useTranslation()
  const [withTrashed, setWithTrashed] = useState(Trashed.Without)
  const [schemas, setSchemas] = useState<SchemaBasicFragment[]>()
  const { data, loading, error, refetch } = useSchemasQuery({
    variables: {
      trashed: withTrashed,
    },
  })

  useEffect(() => {
    if (data?.schemas) setSchemas(data.schemas)
  }, [data])

  if (error) return <ErrorNotifier error={error} />

  return (
    <>
      {loading && <SpinnerOverlay transparent={true} />}
      <Card
        icon={cilCalculator}
        title={t('schemas.index.title')}
        actions={
          <Can permission="schema.create">
            <ButtonAdd to="/app/schemas/create" />
          </Can>
        }
      >
        <>
          <TrashedDropdown initial={withTrashed} handleChange={setWithTrashed} />
          <hr />
          {schemas && <IndexSchemaTable schemas={schemas} refetch={refetch} />}
        </>
      </Card>
    </>
  )
}

export default IndexSchema
