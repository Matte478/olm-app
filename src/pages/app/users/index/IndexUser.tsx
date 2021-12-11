import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cilUser } from '@coreui/icons'

import { PaginatorInfo, Trashed, UserBasicFragment, useUsersQuery } from '__generated__/graphql'
import { Card, ErrorNotifier, PerPageDropdown, SpinnerOverlay, TrashedDropdown } from 'components'
import IndexUserTable from './IndexUserTable'
import { CFormSwitch } from '@coreui/react'

const IndexUser: React.FC = () => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [users, setUsers] = useState<UserBasicFragment[]>()
  // const [withTrashedUsers, setWithTrashedUsers] = useState(false)
  const [withTrashedUsers, setWithTrashedUsers] = useState(Trashed.Without)
  const [paginatorInfo, setPaginatorInfo] = useState<PaginatorInfo>()

  const { data, loading, error, refetch } = useUsersQuery({
    variables: {
      first: perPage,
      page: currentPage,
      trashed: withTrashedUsers,
    },
  })

  useEffect(() => {
    if (data?.users?.paginatorInfo && currentPage > data!.users!.paginatorInfo.lastPage)
      setCurrentPage(data!.users!.paginatorInfo.lastPage)
  }, [data, currentPage])

  useEffect(() => {
    if (data?.users?.data && data?.users?.paginatorInfo) {
      setUsers(data?.users?.data)
      setPaginatorInfo(data?.users?.paginatorInfo)
    }
  }, [data])

  if (error) return <ErrorNotifier error={error} />

  return (
    <Card
      icon={cilUser}
      title={t('users.index.title')}
      actions={<PerPageDropdown selected={perPage} handleChange={setPerPage} />}
    >
      <>
        {loading && <SpinnerOverlay transparent={true} />}
        <TrashedDropdown initial={withTrashedUsers} handleChange={setWithTrashedUsers} />
        <hr />
        {users && paginatorInfo && (
          <IndexUserTable
            users={users}
            paginatorInfo={paginatorInfo}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            refetch={refetch}
          />
        )}
      </>
    </Card>
  )
}

export default IndexUser
