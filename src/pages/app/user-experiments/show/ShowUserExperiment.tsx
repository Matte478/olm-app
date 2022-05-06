import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CAlert, CCol, CRow } from '@coreui/react'
import { cilFile } from '@coreui/icons'

import { UserExperimentExtendedFragment, useUserExperimentQuery } from '__generated__/graphql'
import { ButtonBack, Card, ErrorNotifier, SpinnerOverlay } from 'components'
import { can } from 'utils/permissions'
import { AppStateContext } from 'provider'
import ShowUserExperimentGraph from './ShowUserExperimentGraph'
import ShowUserExperimentInput from './ShowUserExperimentInput'
import ShowUserExperimentForm from './ShowUserExperimentForm'
import ShowUserExperimentDownload from './ShowUserExperimentDownload'
import ShowUserExperimentSchema from './ShowUserExperimentSchema'

const formatExperimentName = (userExperiment: UserExperimentExtendedFragment) => {
  return `${userExperiment.experiment.deviceType.name} [${userExperiment.device?.name}] | ${userExperiment.experiment.software.name}`
}

const ShowUserExperiment: React.FC = () => {
  const { id } = useParams()
  const { appState } = useContext(AppStateContext)
  const { t } = useTranslation()
  const [userExperiment, setUserExperiment] = useState<UserExperimentExtendedFragment>()
  const { data, loading, error } = useUserExperimentQuery({
    variables: {
      id,
    },
  })

  useEffect(() => {
    if (data?.userExperiment) {
      setUserExperiment(data.userExperiment)
    }
  }, [data])

  if (!loading && !data?.userExperiment) return <div>404</div>
  if (error) return <ErrorNotifier error={error} />

  return (
    <Card
      icon={cilFile}
      title={t('actions.show')}
      className="mb-3"
      actions={
        userExperiment?.result ? (
          <ShowUserExperimentDownload
            url={userExperiment?.result}
            userName={userExperiment.user.name}
            deviceType={userExperiment.experiment.deviceType.name}
            createdAt={userExperiment.created_at}
          />
        ) : (
          <></>
        )
      }
    >
      <>
        {loading && <SpinnerOverlay transparent={true} />}
        {userExperiment?.deleted_at && (
          <CAlert color="danger" className="p-2 text-center">
            {t('user_experiments.columns.deleted_at')}: {userExperiment.deleted_at}
          </CAlert>
        )}
        {userExperiment?.filled === null && (
          <CAlert color="warning" className="p-2 text-center">
            {userExperiment?.remote_id ? t('user_experiments.processing') : t('user_experiments.in_queue')}
          </CAlert>
        )}
        {userExperiment?.filled === false && (
          <CAlert color="danger" className="p-2 text-center">
            {t('user_experiments.error_occurred')}
          </CAlert>
        )}
        {userExperiment?.output && (
          <ShowUserExperimentGraph
            data={userExperiment.output}
            title={formatExperimentName(userExperiment)}
          />
        )}
        <CRow>
          <CCol md={6}>
            {userExperiment && (
              <ShowUserExperimentForm
                id={userExperiment.id}
                note={userExperiment?.note}
                disabled={
                  !(
                    can('user_experiment.update_all', appState.authUser) ||
                    can(
                      'user_experiment.update_own',
                      appState.authUser,
                      (user) => user.id === userExperiment.user.id,
                    )
                  ) || userExperiment.deleted_at !== null
                }
              />
            )}
          </CCol>
          <CCol md={6}>
            {userExperiment?.schema && (
              <ShowUserExperimentSchema schema={userExperiment?.schema} className="mb-2" />
            )}
            {userExperiment && <ShowUserExperimentInput input={userExperiment.input} />}
          </CCol>
        </CRow>
        <div className="text-right">
          <ButtonBack />
        </div>
      </>
    </Card>
  )
}

export default ShowUserExperiment
