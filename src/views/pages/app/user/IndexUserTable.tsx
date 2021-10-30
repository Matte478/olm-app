import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { cilPencil, cilTrash, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { TableAction, TableColumn } from '../../../../types'
import { PaginatorInfo, useDeleteUserMutation, User } from '../../../../__generated__/graphql'
import { ErrorNotifier, Pagination, PerPageDropdown, TableList } from '../../../components'

interface Props {
  users: User[]
  refetch: any
  paginatorInfo: PaginatorInfo
  perPage: number
  setPerPage: (perPage: number) => void
  currentPage: number
  setCurrentPage: (page: number) => void
}

const IndexUserTable: React.FC<Props> = ({
  users,
  refetch,
  paginatorInfo,
  perPage,
  setPerPage,
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
        .then(refetch)
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
      // text: t('actions.edit'),
      icon: <CIcon content={cilPencil} />,
      handleClick: (id: string) => {
        navigate(`/app/users/${id}/edit`)
      },
    },
    {
      color: 'danger',
      // text: t('actions.delete'),
      textColor: 'light',
      icon: <CIcon content={cilTrash} />,
      handleClick: handleDeleteUser,
    },
  ]

  if (error) return <ErrorNotifier error={error} />

  return (
    <CCard>
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <strong className="d-flex align-items-center justify-content-center">
          <CIcon content={cilUser} className="me-1" />
          {t('users.index.title')}
        </strong>
        <PerPageDropdown selected={perPage} handleChange={setPerPage} />
      </CCardHeader>
      <CCardBody>
        <TableList columns={columns} data={users} actions={actions} />
        <Pagination
          currentPage={currentPage}
          lastPage={paginatorInfo.lastPage}
          setCurrentPage={setCurrentPage}
        />
      </CCardBody>
    </CCard>
  )
}

export default IndexUserTable
