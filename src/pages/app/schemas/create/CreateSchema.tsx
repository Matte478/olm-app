import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilCalculator } from '@coreui/icons'

import { Card } from 'components'
import CreateSchemaForm from './CreateSchemaForm'

const CreateSchema: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Card icon={cilCalculator} title={t('actions.create')}>
      <CreateSchemaForm />
    </Card>
  )
}

export default CreateSchema
