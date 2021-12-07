import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toast'

import { TableAction, TableColumn } from 'types'
import { UserBasicFragment, PaginatorInfo, useDeleteUserMutation } from '__generated__/graphql'
import { ErrorNotifier, Pagination, Table } from 'components'

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
  const [deleteUserMutation, { error }] = useDeleteUserMutation()

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
      icon: <CIcon content={cilTrash} />,
      handleClick: handleDeleteUser,
    },
  ]

  if (error) return <ErrorNotifier error={error} />

  return (
    <>
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
