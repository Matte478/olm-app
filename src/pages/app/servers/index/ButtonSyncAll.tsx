import React from 'react'
import { useTranslation } from 'react-i18next'
import { cilSync } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'
import { toast } from 'react-toast'

import { Can, ErrorNotifier, SpinnerOverlay } from 'components'
import { ServerBasicFragment, Trashed, useSyncAllServersMutation } from '__generated__/graphql'
import { ApolloError } from '@apollo/client'

interface Props {
  withTrashedServers?: Trashed
  withTrashedDevices?: Trashed
  handleSync: (servers: ServerBasicFragment[]) => void
  refetch: () => void
}

const ButtonSyncAll: React.FC<Props> = ({
  withTrashedServers,
  withTrashedDevices,
  handleSync,
  refetch,
}: Props) => {
  const { t } = useTranslation()

  const [syncAllServersMutation, { loading, error }] = useSyncAllServersMutation()

  const handleSyncAll = async (event: React.FormEvent) => {
    event.preventDefault()

    await syncAllServersMutation({
      variables: {
        trashedServers: withTrashedServers,
        trashedDevices: withTrashedDevices,
      },
    })
      .then((data) => {
        if (data.data?.syncAllServers) {
          toast.success(t('servers.sync_all.success'))
          handleSync(data.data?.syncAllServers)
        }
      })
      .catch(() => {
        console.log('sdfjoisd')
        refetch()
      })
  }

  const getError = (error: ApolloError) => {
    const { message } = error

    if (message) return message.split(' | ')

    return error
  }

  return (
    <>
      {error && <ErrorNotifier error={getError(error)} />}
      {loading && <SpinnerOverlay transparent={true} />}
      <Can permission="server.sync">
        <CButton
          className="me-2 text-light d-inline-flex justify-content-center align-items-center"
          color="success"
          onClick={handleSyncAll}
        >
          <CIcon content={cilSync} className="me-1 text-light" />
          {t('servers.sync_all.button')}
        </CButton>
      </Can>
    </>
  )
}

export default ButtonSyncAll
