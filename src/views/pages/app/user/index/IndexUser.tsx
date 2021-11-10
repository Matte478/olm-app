import { cilUser } from '@coreui/icons'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUsersQuery } from '../../../../../__generated__/graphql'
import { AppCard, ErrorNotifier, PerPageDropdown, SpinnerOverlay } from '../../../../components'
import IndexUserTable from './IndexUserTable'

const IndexUser: React.FC = () => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const { data, loading, error, refetch } = useUsersQuery({
    variables: {
      first: perPage,
      page: currentPage,
    },
  })

  useEffect(() => {
    if (data?.users?.paginatorInfo && currentPage > data!.users!.paginatorInfo.lastPage)
      setCurrentPage(data!.users!.paginatorInfo.lastPage)
  }, [data, currentPage])

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />

  return (
    <AppCard
      icon={cilUser}
      title={t('users.index.title')}
      aditional={<PerPageDropdown selected={perPage} handleChange={setPerPage} />}
    >
      <IndexUserTable
        users={data!.users!.data}
        paginatorInfo={data!.users!.paginatorInfo}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        refetch={refetch}
      />
    </AppCard>
  )
}

export default IndexUser
