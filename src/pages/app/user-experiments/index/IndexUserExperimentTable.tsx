import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { cilActionUndo, cilAlbum, cilCloudDownload, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toast'

import { TableAction, TableColumn } from 'types'
import {
  PaginatorInfo,
  useDeleteUserExperimentMutation,
  useRestoreUserExperimentMutation,
  UserExperimentBasicFragment,
} from '__generated__/graphql'
import { ErrorNotifier, Pagination, SpinnerOverlay, Table } from 'components'
import { can } from 'utils/permissions'
import { AppStateContext } from 'provider'

interface Props {
  userExperiments: UserExperimentBasicFragment[]
  refetch: () => void
  paginatorInfo: PaginatorInfo
  currentPage: number
  setCurrentPage: (page: number) => void
}

const IndexUserExperimentTable: React.FC<Props> = ({
  userExperiments,
  refetch,
  paginatorInfo,
  currentPage,
  setCurrentPage,
}: Props) => {
  const { appState } = useContext(AppStateContext)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [deleteUserExperimentMutation, deleteUserExperiment] = useDeleteUserExperimentMutation()
  const [restoreUserExperimentMutation, restoreUserExperiment] = useRestoreUserExperimentMutation()

  const checkPermission = (id: string, permission: string) => {
    const userExperiment = userExperiments.find((ue) => ue.id === id)
    if (!userExperiment) return false

    if (
      can(`user_experiment.${permission}_all`, appState.authUser) ||
      can(
        `user_experiment.${permission}_own`,
        appState.authUser,
        (user) => user.id === userExperiment.user.id,
      )
    ) {
      return true
    }

    toast.error(t('actions.error.not-authorized'))
    return false
  }

  const handleDeleteUserExperiment = async (id: string) => {
    if (!checkPermission(id, 'delete')) return

    let response = window.confirm(t('user_experiments.delete.confirm'))
    if (response) {
      await deleteUserExperimentMutation({
        variables: { id },
      })
        .then(() => {
          refetch()
          toast.success(t('user_experiments.delete.success'))
        })
        .catch(() => {
          toast.error(t('user_experiments.delete.error'))
        })
    }
  }

  const handleRestoreUserExperiment = async (id: string) => {
    if (!checkPermission(id, 'restore')) return

    let response = window.confirm(t('user_experiments.restore.confirm'))
    if (response) {
      await restoreUserExperimentMutation({
        variables: { id },
      })
        .then(() => {
          refetch()
          toast.success(t('user_experiments.restore.success'))
        })
        .catch(() => {})
    }
  }

  const handleDownloadResult = (id: string) => {
    if (!checkPermission(id, 'show')) return

    userExperiments.forEach((userExperiment) => {
      if (userExperiment.id === id) {
        if (!userExperiment.result) {
          toast.error(t('user_experiments.download.error'))
          return
        }
        fetch(userExperiment.result)
          .then((response) => {
            response.blob().then((blob) => {
              const fileExt = userExperiment.result?.split('.').pop()
              const url = window.URL.createObjectURL(blob)
              let a = document.createElement('a')
              a.href = url
              a.download = `${userExperiment.user.name}_${userExperiment.experiment.deviceType.name}_${userExperiment.created_at}.${fileExt}`
              a.click()
              toast.success(t('user_experiments.download.success'))
            })
          })
          .catch((error) => {
            toast.error(t('user_experiments.download.error'))
            console.log(error, error.error)
          })
      }
    })
  }

  const columns: TableColumn[] = [
    {
      column: 'id',
      name: t('user_experiments.columns.id'),
      style: { width: '80px' },
    },
    {
      column: 'filled',
      name: t('user_experiments.columns.filled'),
    },
    {
      column: 'user.name',
      name: t('user_experiments.columns.user'),
    },
    {
      column: 'experiment.deviceType.name',
      name: t('user_experiments.columns.device_type'),
    },
    {
      column: 'experiment.device.name',
      name: t('user_experiments.columns.device'),
    },
    {
      column: 'experiment.software.name',
      name: t('user_experiments.columns.software'),
    },
    {
      column: 'simulation_time',
      name: t('user_experiments.columns.simulation_time'),
    },
    {
      column: 'created_at',
      name: t('user_experiments.columns.created_at'),
    },
  ]

  const actions: TableAction[] = [
    {
      color: 'warning',
      icon: <CIcon content={cilAlbum} />,
      permission: ['user_experiment.show_all', 'user_experiment.show_own'],
      handleClick: (id: string) => {
        if (!checkPermission(id, 'show')) return
        navigate(`/app/user-experiments/${id}/show`)
      },
    },
    {
      color: 'success',
      textColor: 'light',
      permission: ['user_experiment.show_all', 'user_experiment.show_own'],
      icon: <CIcon content={cilCloudDownload} />,
      handleClick: handleDownloadResult,
    },
    {
      color: 'danger',
      textColor: 'light',
      permission: ['user_experiment.delete_all', 'user_experiment.delete_own'],
      onDeleted: false,
      icon: <CIcon content={cilTrash} />,
      handleClick: handleDeleteUserExperiment,
    },
    {
      color: 'dark',
      textColor: 'light',
      permission: ['user_experiment.restore_all', 'user_experiment.restore_own'],
      onNonDeleted: false,
      text: t('user_experiments.restore.button'),
      icon: <CIcon content={cilActionUndo} />,
      handleClick: handleRestoreUserExperiment,
    },
  ]

  return (
    <>
      {deleteUserExperiment.error && <ErrorNotifier error={deleteUserExperiment.error} />}
      {restoreUserExperiment.error && <ErrorNotifier error={restoreUserExperiment.error} />}
      {(deleteUserExperiment.loading || restoreUserExperiment.loading) && (
        <SpinnerOverlay transparent={true} />
      )}
      <Table columns={columns} data={userExperiments} actions={actions} />
      <Pagination
        currentPage={currentPage}
        lastPage={paginatorInfo.lastPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  )
}

export default IndexUserExperimentTable
