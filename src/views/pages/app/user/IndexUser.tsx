import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilUser } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { useUsersQuery } from '../../../../__generated__/graphql'
import { Pagination, PerPageDropdown, TableList } from '../../../components'
import { TableAction, TableColumn } from '../../../../types'

const IndexUser: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const { t } = useTranslation()

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
    },
    {
      color: 'danger',
      // text: t('actions.delete'),
      textColor: 'light',
      icon: <CIcon content={cilTrash} />,
    },
  ]

  const { data, loading, error } = useUsersQuery({
    variables: {
      first: perPage,
      page: currentPage,
    },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const paginatorInfo = data!.users!.paginatorInfo

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
