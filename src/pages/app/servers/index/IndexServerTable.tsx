import { cilPencil, cilReload, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Table } from 'components'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { TableAction, TableColumn } from 'types'
import { Server } from '__generated__/graphql'

interface Props {
  servers: any
}

const IndexServerTable: React.FC<Props> = ({ servers }: Props) => {
  console.log(servers)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const columns: TableColumn[] = [
    {
      column: 'id',
      name: t('servers.columns.id'),
      style: { width: '80px' },
    },
    {
      column: 'name',
      name: t('servers.columns.name'),
    },
    {
      column: 'ip_address',
      name: t('servers.columns.ip_address'),
    },
    // {
    //   column: 'port',
    //   name: t('servers.columns.port'),
    // },
    // {
    //   column: 'websocket_port',
    //   name: t('servers.columns.websocket_port'),
    // },
    {
      column: 'available',
      name: t('servers.columns.available'),
    },
    {
      column: 'production',
      name: t('servers.columns.production'),
    },
    {
      column: 'enabled',
      name: t('servers.columns.enabled'),
    },
    // {
    //   column: 'created_at',
    //   name: t('servers.columns.created_at'),
    // },
    // {
    //   column: 'updated_at',
    //   name: t('servers.columns.updated_at'),
    // },
  ]

  const columnsNested = {
    key: 'devices',
    name: 'devices',
    columns: [
      {
        column: 'id',
        name: 'id',
        style: { width: '80px' },
      },
      {
        column: 'name',
        name: 'name',
      },
      {
        column: 'deviceType.name',
        name: 'type',
      },
      {
        column: 'software.name',
        name: 'software',
      },
    ],
  }

  const actions: TableAction[] = [
    {
      color: 'success',
      textColor: 'light',
      permission: 'server.sync',
      icon: <CIcon content={cilReload} />,
      handleClick: console.log,
    },
    {
      color: 'primary',
      icon: <CIcon content={cilPencil} />,
      permission: 'server.update',
      handleClick: (id: string) => {
        navigate(`/app/servers/${id}/edit`)
      },
    },
    {
      color: 'danger',
      textColor: 'light',
      permission: 'server.delete',
      icon: <CIcon content={cilTrash} />,
      handleClick: console.log,
    },
  ]

  return (
    <div>
      <Table columns={columns} columnsNested={columnsNested} data={servers} actions={actions} />
    </div>
  )
}

export default IndexServerTable
