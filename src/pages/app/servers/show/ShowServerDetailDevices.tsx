import React from 'react'
import { cilDevices } from '@coreui/icons'
import { CFormSwitch } from '@coreui/react'
import { useTranslation } from 'react-i18next'

import { DeviceBasicFragment } from '__generated__/graphql'
import { Card, Table } from 'components'

interface Props {
  devices: DeviceBasicFragment[]
  withTrashedDevices: boolean
  setWithTrashedDevices: (withTrashed: boolean) => void
}

const ShowServerDetailDevices: React.FC<Props> = ({
  devices,
  withTrashedDevices,
  setWithTrashedDevices,
}: Props) => {
  const { t } = useTranslation()

  const columns = [
    {
      column: 'id',
      name: t('servers.columns.devices.id'),
      style: { width: '80px' },
    },
    {
      column: 'name',
      name: t('servers.columns.devices.name'),
    },
    {
      column: 'deviceType.name',
      name: t('servers.columns.devices.type'),
    },
    {
      column: 'software.name',
      name: t('servers.columns.devices.software'),
    },
  ]

  return (
    <Card icon={cilDevices} title={t('servers.columns.devices.title')}>
      <CFormSwitch
        label={t('servers.with_deleted_devices')}
        id="withTrashedServers"
        name="withTrashedServers"
        checked={withTrashedDevices}
        onChange={() => setWithTrashedDevices(!withTrashedDevices)}
        className="me-3"
      />
      <hr />

      <Table columns={columns} data={devices} />
    </Card>
  )
}

export default ShowServerDetailDevices
