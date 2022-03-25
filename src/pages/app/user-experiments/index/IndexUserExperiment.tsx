import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cilFile } from '@coreui/icons'
import { CFormSwitch } from '@coreui/react'

import {
  PaginatorInfo,
  Trashed,
  UserExperimentBasicFragment,
  useUserExperimentsQuery,
} from '__generated__/graphql'
import { AppStateContext } from 'provider'
import { Card, ErrorNotifier, PerPageDropdown, SpinnerOverlay, TrashedDropdown } from 'components'
import { can } from 'utils/permissions'
import IndexUserExperimentTable from './IndexUserExperimentTable'

const IndexUserExperiment: React.FC = () => {
  const { appState } = useContext(AppStateContext)
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [userExperiments, setUserExperiments] = useState<UserExperimentBasicFragment[]>()
  const [withTrashed, setWithTrashed] = useState(Trashed.Without)
  const [paginatorInfo, setPaginatorInfo] = useState<PaginatorInfo>()
  const [onlyMine, setOnlyMine] = useState(!can('user_experiment.show_all', appState.authUser))

  const { data, loading, error, refetch } = useUserExperimentsQuery({
    variables: {
      first: perPage,
      page: currentPage,
      trashed: withTrashed,
      onlyMine: onlyMine,
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
      icon={cilFile}
      title={t('user_experiments.index.title')}
      actions={<PerPageDropdown selected={perPage} handleChange={setPerPage} />}
    >
      <>
        {loading && <SpinnerOverlay transparent={true} />}
        <div className="d-flex align-items-center">
          <TrashedDropdown initial={withTrashed} handleChange={setWithTrashed} />
          <CFormSwitch
            label={t('user_experiments.only_mine')}
            id="withTrashedServers"
            name="withTrashedServers"
            checked={onlyMine}
            disabled={!can('user_experiment.show_all', appState.authUser)}
            onChange={() => setOnlyMine(!onlyMine)}
            className="ms-3"
          />
        </div>
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
