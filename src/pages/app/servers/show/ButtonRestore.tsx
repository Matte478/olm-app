import React from 'react'
import { cilActionUndo } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'

import { ServerExtendedFragment, Trashed, useRestoreServerExtendedMutation } from '__generated__/graphql'
import { ErrorNotifier, SpinnerOverlay } from 'components'

interface Props {
  id: string
  handleRestore: (server: ServerExtendedFragment) => void
  withTrashedDevices?: Trashed
}

const ButtonRestore: React.FC<Props> = ({ id, handleRestore, withTrashedDevices }: Props) => {
  const { t } = useTranslation()
  const [restoreServerExtendedMutation, { loading, error }] = useRestoreServerExtendedMutation()

  const handleRestoreServer = async () => {
    let response = window.confirm(t('servers.restore.confirm'))
    if (response) {
      await restoreServerExtendedMutation({
        variables: { id, trashedDevices: withTrashedDevices },
      })
        .then((data) => {
          if (data?.data?.restoreServer) {
            handleRestore(data.data.restoreServer)
            toast.success(t('servers.restore.success'))
          }
        })
        .catch(() => {})
    }
  }

  if (error) return <ErrorNotifier error={error} />

  return (
    <>
      {loading && <SpinnerOverlay transparent={true} />}
      <CButton
        className="d-inline-flex justify-content-center align-items-center"
        color="dark"
        onClick={handleRestoreServer}
      >
        <CIcon className="me-1" content={cilActionUndo} />
        {t('servers.restore.button')}
      </CButton>
    </>
  )
}

export default ButtonRestore
