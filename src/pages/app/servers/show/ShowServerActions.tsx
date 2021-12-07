import React from 'react'

import { ButtonEdit, Can } from 'components'
import { ServerExtendedFragment, Trashed } from '__generated__/graphql'
import ButtonSync from './ButtonSync'
import ButtonRestore from './ButtonRestore'

interface Props {
  id: string
  withTrashedDevices: boolean
  setServer: (server: ServerExtendedFragment) => void
  deletedAt?: string
}

const ShowServerActions: React.FC<Props> = ({
  id,
  withTrashedDevices,
  setServer,
  deletedAt,
}: Props) => {
  return (
    <>
      {deletedAt ? (
        <Can permission="server.delete">
          <ButtonRestore
            id={id}
            withTrashedDevices={withTrashedDevices ? Trashed.With : Trashed.Without}
            handleRestore={setServer}
          />
        </Can>
      ) : (
        <>
          <Can permission="server.sync">
            <ButtonSync
              id={id}
              withTrashedDevices={withTrashedDevices ? Trashed.With : Trashed.Without}
              handleSync={setServer}
            />
          </Can>
          <Can permission="server.update">
            <ButtonEdit to={`/app/servers/${id}/edit`} />
          </Can>
        </>
      )}
    </>
  )
}

export default ShowServerActions
