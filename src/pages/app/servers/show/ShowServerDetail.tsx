import React from 'react'
import { CAlert, CForm, CFormFloating, CFormInput, CFormLabel, CFormSwitch } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { cilLan } from '@coreui/icons'

import { ServerExtendedFragment, Trashed } from '__generated__/graphql'
import { Card } from 'components'

interface Props {
  server: ServerExtendedFragment
  withTrashedDevices?: Trashed
  actions?: JSX.Element | JSX.Element[]
}

const ShowServerDetail: React.FC<Props> = ({ server, actions }: Props) => {
  const { t } = useTranslation()

  return (
    <Card icon={cilLan} title={t('actions.show')} className="mb-3" actions={actions}>
      {server.deleted_at && (
        <CAlert color="danger" className="p-2 text-center">
          {t('servers.columns.deleted_at')}: {server.deleted_at}
        </CAlert>
      )}
      <CForm>
        <CFormFloating className="mb-3">
          <CFormInput type="text" id="name" value={server.name} disabled />
          <CFormLabel>{t('servers.columns.name')}</CFormLabel>
        </CFormFloating>
        <CFormFloating className="mb-3">
          <CFormInput type="text" id="ip_address" value={server.ip_address} disabled />
          <CFormLabel>{t('servers.columns.ip_address')}</CFormLabel>
        </CFormFloating>
        <CFormFloating className="mb-3">
          <CFormInput type="number" id="websocket_port" value={server.websocket_port} disabled />
          <CFormLabel>{t('servers.columns.websocket_port')}</CFormLabel>
        </CFormFloating>
        <CFormSwitch
          label={t('servers.columns.production')}
          id="production"
          checked={server.production}
          disabled
        />
        <CFormSwitch
          label={t('servers.columns.enabled')}
          id="enabled"
          checked={server.enabled}
          disabled
        />
      </CForm>
    </Card>
  )
}

export default ShowServerDetail
