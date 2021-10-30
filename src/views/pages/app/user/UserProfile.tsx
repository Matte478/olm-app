import React, { useContext } from 'react'
import { AppStateContext } from '../../../../provider'
import EditUserForm from './EditUserForm'

const UserProfile: React.FC = () => {
  const { appState, appSetAuthUser } = useContext(AppStateContext)

  return <EditUserForm user={appState.authUser!} handleUpdateUser={appSetAuthUser} />
}

export default UserProfile
