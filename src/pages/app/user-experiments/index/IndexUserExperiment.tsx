import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cilUser } from '@coreui/icons'

import {
  PaginatorInfo,
  Trashed,
  UserBasicFragment,
  UserExperimentBasicFragment,
  useUserExperimentsQuery,
  useUsersQuery,
} from '__generated__/graphql'
import { Card, ErrorNotifier, PerPageDropdown, SpinnerOverlay, TrashedDropdown } from 'components'
import IndexUserExperimentTable from './IndexUserExperimentTable'
// import IndexUserTable from './IndexUserTable'

const IndexUserExperiment: React.FC = () => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [userExperiments, setUserExperiments] = useState<UserExperimentBasicFragment[]>()
  const [withTrashedUsers, setWithTrashedUsers] = useState(Trashed.Without)
  const [paginatorInfo, setPaginatorInfo] = useState<PaginatorInfo>()

  const { data, loading, error, refetch } = useUserExperimentsQuery({
    variables: {
      first: perPage,
      page: currentPage,
      trashed: withTrashedUsers,
    },
  })

  useEffect(() => {
    if (
      data?.userExperiments?.paginatorInfo &&
      currentPage > data.userExperiments.paginatorInfo.lastPage
    )
      setCurrentPage(data.userExperiments.paginatorInfo.lastPage)
  }, [data, currentPage])

  useEffect(() => {
    if (data?.userExperiments?.data && data.userExperiments.paginatorInfo) {
      setUserExperiments(data?.userExperiments?.data)
      setPaginatorInfo(data?.userExperiments?.paginatorInfo)
    }
  }, [data])

  if (error) return <ErrorNotifier error={error} />

  return (
    <Card
      icon={cilUser}
      title={t('user_experiments.index.title')}
      actions={<PerPageDropdown selected={perPage} handleChange={setPerPage} />}
    >
      <>
        {loading && <SpinnerOverlay transparent={true} />}
        <TrashedDropdown initial={withTrashedUsers} handleChange={setWithTrashedUsers} />
        <hr />
        {userExperiments && paginatorInfo && (
          <IndexUserExperimentTable
            userExperiments={userExperiments}
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

export default IndexUserExperiment
