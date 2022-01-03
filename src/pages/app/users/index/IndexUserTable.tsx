import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { cilActionUndo, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toast'

import { TableAction, TableColumn } from 'types'
import {
  UserBasicFragment,
  PaginatorInfo,
  useDeleteUserMutation,
  useRestoreUserMutation,
} from '__generated__/graphql'
import { ErrorNotifier, Pagination, SpinnerOverlay, Table } from 'components'

interface Props {
  users: UserBasicFragment[]
  refetch: () => void
  paginatorInfo: PaginatorInfo
  currentPage: number
  setCurrentPage: (page: number) => void
}

const IndexUserTable: React.FC<Props> = ({
  users,
  refetch,
  paginatorInfo,
  currentPage,
  setCurrentPage,
}: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [deleteUserMutation, deleteUser] = useDeleteUserMutation()
  const [restoreUserMutation, restoreUser] = useRestoreUserMutation()

  const handleDeleteUser = async (id: string) => {
    let response = window.confirm(t('users.delete.confirm'))
    if (response) {
      await deleteUserMutation({
        variables: { id },
      })
        .then(() => {
          refetch()
          toast.success(t('users.delete.success'))
        })
        .catch(() => {})
    }
  }

  const handleRestoreUser = async (id: string) => {
    let response = window.confirm(t('users.restore.confirm'))
    if (response) {
      await restoreUserMutation({
        variables: { id },
      })
        .then(() => {
          refetch()
          toast.success(t('users.restore.success'))
        })
        .catch(() => {})
    }
  }

  const columns: TableColumn[] = [
    {
      column: 'id',
      name: t('users.columns.id'),
      style: { width: '80px' },
    },
    {
      column: 'name',
      name: t('users.columns.name'),
    },
    {
      column: 'email',
      name: t('users.columns.email'),
    },
    {
      column: 'created_at',
      name: t('users.columns.created-at'),
    },
  ]

  const actions: TableAction[] = [
    {
      color: 'primary',
      icon: <CIcon content={cilPencil} />,
      permission: 'user.update',
      handleClick: (id: string) => {
        navigate(`/app/users/${id}/edit`)
      },
    },
    {
      color: 'danger',
      textColor: 'light',
      permission: 'user.delete',
      onDeleted: false,
      icon: <CIcon content={cilTrash} />,
      handleClick: handleDeleteUser,
    },
    {
      color: 'dark',
      textColor: 'light',
      permission: 'user.restore',
      onNonDeleted: false,
      text: t('users.restore.button'),
      icon: <CIcon content={cilActionUndo} />,
      handleClick: handleRestoreUser,
    },
  ]

  return (
    <>
      {deleteUser.error && <ErrorNotifier error={deleteUser.error} />}
      {restoreUser.error && <ErrorNotifier error={restoreUser.error} />}
      {(deleteUser.loading || restoreUser.loading) && <SpinnerOverlay transparent={true} />}
      <Table columns={columns} data={users} actions={actions} />
      <Pagination
        currentPage={currentPage}
        lastPage={paginatorInfo.lastPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  )
}

export default IndexUserTable
