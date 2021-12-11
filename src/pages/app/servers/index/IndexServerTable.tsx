import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cilActionUndo, cilAlbum, cilPencil, cilSync, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toast'

import { ErrorNotifier, SpinnerOverlay, Table } from 'components'
import { TableAction, TableColumn } from 'types'
import {
  ServerBasicFragment,
  Trashed,
  useDeleteServerMutation,
  useRestoreServerMutation,
  useSyncServerMutation,
} from '__generated__/graphql'

interface Props {
  servers: ServerBasicFragment[]
  refetch: () => void
}

const IndexServerTable: React.FC<Props> = ({ servers, refetch }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [deleteServerMutation, deleteServer] = useDeleteServerMutation()
  const [restoreServerMutation, restoreServer] = useRestoreServerMutation()
  const [syncServerMutation, syncServer] = useSyncServerMutation()

  const handleDeleteServer = async (id: string) => {
    let response = window.confirm(t('servers.delete.confirm'))
    if (response) {
      await deleteServerMutation({
        variables: { id },
      })
        .then(() => {
          refetch()
          toast.success(t('servers.delete.success'))
        })
        .catch(() => {})
    }
  }

  const handleRestoreServer = async (id: string) => {
    let response = window.confirm(t('servers.restore.confirm'))
    if (response) {
      await restoreServerMutation({
        variables: { id },
      })
        .then(() => {
          refetch()
          toast.success(t('servers.restore.success'))
        })
        .catch(() => {})
    }
  }

  const handleSyncServer = async (id: string) => {
    await syncServerMutation({
      variables: { id, trashedDevices: Trashed.Without },
    })
      .then(() => {
        refetch()
        toast.success(t('servers.sync.success'))
      })
      .catch(() => {})
  }

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
    name: t('servers.columns.devices.title'),
    columns: [
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
    ],
  }

  const actions: TableAction[] = [
    {
      color: 'success',
      textColor: 'light',
      permission: 'server.sync',
      onDeleted: false,
      icon: <CIcon content={cilSync} />,
      handleClick: handleSyncServer,
    },
    {
      color: 'warning',
      // textColor: 'light',
      permission: 'server.show',
      onDeleted: true,
      icon: <CIcon content={cilAlbum} />,
      handleClick: (id: string) => {
        navigate(`/app/servers/${id}/show`)
      },
    },
    {
      color: 'primary',
      permission: 'server.update',
      onDeleted: false,
      icon: <CIcon content={cilPencil} />,
      handleClick: (id: string) => {
        navigate(`/app/servers/${id}/edit`)
      },
    },
    {
      color: 'danger',
      textColor: 'light',
      permission: 'server.delete',
      onDeleted: false,
      icon: <CIcon content={cilTrash} />,
      handleClick: handleDeleteServer,
    },
    {
      color: 'dark',
      textColor: 'light',
      permission: 'server.restore',
      onNonDeleted: false,
      text: t('servers.restore.button'),
      icon: <CIcon content={cilActionUndo} />,
      handleClick: handleRestoreServer,
    },
  ]

  return (
    <div>
      {deleteServer.error && <ErrorNotifier error={deleteServer.error} />}
      {restoreServer.error && <ErrorNotifier error={restoreServer.error} />}
      {syncServer.error && <ErrorNotifier error={syncServer.error} />}
      {(deleteServer.loading || restoreServer.loading || syncServer.loading) && (
        <SpinnerOverlay transparent={true} />
      )}
      <Table columns={columns} columnsNested={columnsNested} data={servers} actions={actions} />
    </div>
  )
}

export default IndexServerTable
