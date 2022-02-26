import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilSync } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'
import { toast } from 'react-toast'

import { Can, ErrorNotifier, SpinnerOverlay } from 'components'
import {
  ServerExtendedFragment,
  Trashed,
  useSyncServerExtendedMutation,
} from '__generated__/graphql'

interface Props {
  id: string
  handleSync: (server: ServerExtendedFragment) => void
  withTrashedDevices?: Trashed
}

const ButtonSync: React.FC<Props> = ({ id, handleSync, withTrashedDevices }: Props) => {
  const { t } = useTranslation()
  const [syncServerMutation, { loading, error }] = useSyncServerExtendedMutation()

  const handleSyncServer = async () => {
    await syncServerMutation({
      variables: { id, trashedDevices: withTrashedDevices },
    })
      .then((data) => {
        if (data.data?.syncServer) {
          toast.success(t('servers.sync.success'))
          handleSync(data.data?.syncServer)
        }
      })
      .catch(() => {})
  }

  return (
    <>
      {error && <ErrorNotifier error={error} />}
      {loading && <SpinnerOverlay transparent={true} />}
      <Can permission="server.sync">
        <CButton
          className="me-2 text-light d-inline-flex justify-content-center align-items-center"
          color="success"
          onClick={handleSyncServer}
        >
          <CIcon content={cilSync} className="me-1 text-light" />
          {t('servers.sync.button')}
        </CButton>
      </Can>
    </>
  )
}

export default ButtonSync
