import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { cilLockLocked, cilPencil, cilPlus, cilTrash, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { TableAction, TableColumn } from '../../../../types'
import { Role, useDeleteRoleMutation } from '../../../../__generated__/graphql'
import { ErrorNotifier, TableList } from '../../../components'

interface Props {
  roles: Role[]
  refetch: any
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
        .then(refetch)
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
      handleClick: (id: string) => {
        navigate(`/app/roles/${id}/edit`)
      },
    },
    {
      color: 'danger',
      textColor: 'light',
      icon: <CIcon content={cilTrash} />,
      handleClick: handleDeleteUser,
    },
  ]

  if (error) return <ErrorNotifier error={error} />

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex align-items-center justify-content-between">
          <strong className="d-flex align-items-center justify-content-center">
            <CIcon content={cilLockLocked} className="me-1" />
            {t('roles.index.title')}
          </strong>
          <Link to="/app/roles/create">
            <CButton className="text-center">
              <CIcon content={cilPlus} />
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <TableList columns={columns} data={roles} actions={actions} />
        </CCardBody>
      </CCard>
    </div>
  )
}

export default IndexRoleTable
