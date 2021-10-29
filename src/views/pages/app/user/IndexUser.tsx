import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilUser } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  useDeleteUserMutation,
  UsersDocument,
  useUsersQuery,
} from '../../../../__generated__/graphql'
import { Pagination, PerPageDropdown, SpinnerOverlay, TableList } from '../../../components'
import { TableAction, TableColumn } from '../../../../types'

const IndexUser: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [deleteUserMutation, deleteRes] = useDeleteUserMutation()

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
      handleClick: async (id: string) => {
        let response = window.confirm(t('users.delete.confirm'))
        if (response) {
          await deleteUserMutation({
            variables: { id },
            refetchQueries: [
              {
                query: UsersDocument,
                variables: {
                  first: perPage,
                  page: currentPage,
                },
              },
            ],
          }).catch(() => {})
        }
      },
    },
  ]

  const { data, loading, error } = useUsersQuery({
    variables: {
      first: perPage,
      page: currentPage,
    },
  })

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <p>Error: {error.message}</p>

  const paginatorInfo = data!.users!.paginatorInfo

  if (currentPage > paginatorInfo.lastPage) setCurrentPage(paginatorInfo.lastPage)

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
        <TableList columns={columns} data={data!.users!.data} actions={actions} />
        <Pagination
          currentPage={currentPage}
          lastPage={paginatorInfo.lastPage}
          setCurrentPage={setCurrentPage}
        />
      </CCardBody>
    </CCard>
  )
}

export default IndexUser
