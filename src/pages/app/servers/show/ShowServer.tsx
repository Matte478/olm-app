import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { ErrorNotifier, SpinnerOverlay } from 'components'
import { ServerExtendedFragment, Trashed, useServerQuery } from '__generated__/graphql'
import ShowServerDetail from './ShowServerDetail'
import ShowServerDetailDevices from './ShowServerDetailDevices'
import ShowServerActions from './ShowServerActions'

const ShowServer: React.FC = () => {
  const { id } = useParams()
  const [withTrashedDevices, setWithTrashedDevices] = useState(false)
  const [server, setServer] = useState<ServerExtendedFragment>()
  const { data, loading, error } = useServerQuery({
    variables: {
      id,
      trashedDevices: withTrashedDevices ? Trashed.With : Trashed.Without,
    },
  })

  useEffect(() => {
    if (data?.server) setServer(data.server)
  }, [data])

  if (!loading && !data?.server) return <div>404</div>
  if (error) return <ErrorNotifier error={error} />

  return (
    <>
      {loading && <SpinnerOverlay transparent={true} />}
      {server && (
        <ShowServerDetail
          server={server}
          actions={
            <ShowServerActions
              id={server.id}
              withTrashedDevices={withTrashedDevices}
              setServer={setServer}
              deletedAt={server.deleted_at}
            />
          }
        />
      )}
      {server?.devices && (
        <ShowServerDetailDevices
          devices={server?.devices}
          withTrashedDevices={withTrashedDevices}
          setWithTrashedDevices={setWithTrashedDevices}
        />
      )}
    </>
  )
}

export default ShowServer
