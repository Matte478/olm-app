import React, { useEffect, useState } from 'react'
import { useUsersQuery } from '../../../../__generated__/graphql'
import { ErrorNotifier, SpinnerOverlay } from '../../../components'
import IndexUserTable from './IndexUserTable'

const IndexUser: React.FC = () => {
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
  }, [data])

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />

  return (
    <IndexUserTable
      users={data!.users!.data}
      paginatorInfo={data!.users!.paginatorInfo}
      perPage={perPage}
      setPerPage={setPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      refetch={refetch}
    />
  )
}

export default IndexUser
