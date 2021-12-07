import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilLan } from '@coreui/icons'

import { Card } from 'components'
import CreateServerForm from './CreateServerForm'

const CreateServer: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Card icon={cilLan} title={t('actions.create')}>
      <CreateServerForm />
    </Card>
  )
}

export default CreateServer
