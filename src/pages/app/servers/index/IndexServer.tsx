import React from 'react'
import { cilLan, cilReload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'
import { useTranslation } from 'react-i18next'

import { ButtonAdd, Can, Card, ErrorNotifier, SpinnerOverlay } from 'components'
import { Trashed, useServersAndDevicesQuery } from '__generated__/graphql'
import IndexServerTable from './IndexServerTable'

const IndexServer: React.FC = () => {
  const { t } = useTranslation()
  const { data, loading, error, refetch } = useServersAndDevicesQuery({
    variables: {
      trashedServers: Trashed.With,
      trashedDevices: Trashed.With,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />

  return (
    <Card
      icon={cilLan}
      title={t('servers.index.title')}
      actions={
        <>
          <Can permission="server.sync">
            <CButton
              className="me-2 text-light d-inline-flex justify-content-center align-items-center"
              color="success"
            >
              <CIcon content={cilReload} className="me-1 text-light" />
              Sync all servers
            </CButton>
          </Can>
          <Can permission="server.create">
            <ButtonAdd to="/app/servers/create" />
          </Can>
        </>
      }
    >
      <IndexServerTable servers={data?.servers} />
    </Card>
  )
}

export default IndexServer
