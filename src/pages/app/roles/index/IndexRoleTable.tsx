import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toast'

import { TableAction, TableColumn } from 'types'
import { RoleBasicFragment, useDeleteRoleMutation } from '__generated__/graphql'
import { ErrorNotifier, Table } from 'components'

interface Props {
  roles: RoleBasicFragment[]
  refetch: () => void
}

const IndexRoleTable: React.FC<Props> = ({ roles, refetch }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [deleteRoleMutation, { error }] = useDeleteRoleMutation()

  const handleDeleteUser = async (id: string) => {
    let response = window.confirm(t('users.delete.confirm'))
    if (response) {
      await deleteRoleMutation({
        variables: { id },
      })
        .then(() => {
          refetch()
          toast.success(t('roles.delete.success'))
        })
        .catch(() => {})
    }
  }

  const columns: TableColumn[] = [
    {
      column: 'id',
      name: t('roles.columns.id'),
      style: { width: '80px' },
    },
    {
      column: 'name',
      name: t('roles.columns.name'),
    },
  ]

  const actions: TableAction[] = [
    {
      color: 'primary',
      icon: <CIcon content={cilPencil} />,
      permission: 'role.update',
      handleClick: (id: string) => {
        navigate(`/app/roles/${id}/edit`)
      },
    },
    {
      color: 'danger',
      textColor: 'light',
      permission: 'role.delete',
      icon: <CIcon content={cilTrash} />,
      handleClick: handleDeleteUser,
    },
  ]

  if (error) return <ErrorNotifier error={error} />

  return <Table columns={columns} data={roles} actions={actions} />
}

export default IndexRoleTable
