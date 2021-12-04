import React, { useEffect, useState } from 'react'
import { cilLan } from '@coreui/icons'
import { CFormSwitch } from '@coreui/react'
import { useTranslation } from 'react-i18next'

import { ButtonAdd, Can, Card, ErrorNotifier, SpinnerOverlay } from 'components'
import { Server, Trashed, useServersAndDevicesQuery } from '__generated__/graphql'
import IndexServerTable from './IndexServerTable'
import ButtonSyncAll from './ButtonSyncAll'

const IndexServer: React.FC = () => {
  const [withTrashedServers, setWithTrashedServers] = useState(false)
  const [withTrashedDevices, setWithTrashedDevices] = useState(false)
  const [servers, setServers] = useState<any>()
  const { t } = useTranslation()
  const { data, loading, error, refetch } = useServersAndDevicesQuery({
    variables: {
      trashedServers: withTrashedServers ? Trashed.With : Trashed.Without,
      trashedDevices: withTrashedDevices ? Trashed.With : Trashed.Without,
    },
  })

  useEffect(() => {
    if(data?.servers)
      setServers(data?.servers)
  }, [data])

  if (error) return <ErrorNotifier error={error} />

  return (
    <>
      {loading && <SpinnerOverlay transparent={true} />}
      <Card
        icon={cilLan}
        title={t('servers.index.title')}
        actions={
          <>
            <ButtonSyncAll
              withTrashedServers={withTrashedServers ? Trashed.With : Trashed.Without}
              withTrashedDevices={withTrashedDevices ? Trashed.With : Trashed.Without}
              handleSync={setServers}
            />
            <Can permission="server.create">
              <ButtonAdd to="/app/servers/create" />
            </Can>
          </>
        }
      >
        <div className="d-flex">
          <CFormSwitch
            label={t('servers.with_deleted_servers')}
            id="withTrashedServers"
            name="withTrashedServers"
            checked={withTrashedServers}
            onChange={() => setWithTrashedServers(!withTrashedServers)}
            className="me-3"
          />
          <CFormSwitch
            label={t('servers.with_deleted_devices')}
            id="withTrashedDevices"
            name="withTrashedDevices"
            checked={withTrashedDevices}
            onChange={() => setWithTrashedDevices(!withTrashedDevices)}
          />
        </div>
        <hr />
        {servers ? <IndexServerTable servers={servers} refetch={refetch} /> : <></>}
      </Card>
    </>
  )
}

export default IndexServer
