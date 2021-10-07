import React, { useState, useEffect, useContext } from 'react'
import { useRoutes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { AppStateContext, fetchAccessToken, fetchAuthUser } from './provider'
import routes from './routes'
import { User } from './__generated__/graphql'
import './scss/style.scss'

let initialized = false
const App = () => {
  const [loading, setLoading] = useState(true)
  const { appState, appSetLogout, appSetAuthToken, appSetAuthUser, appGetRefreshToken } =
    useContext(AppStateContext)
  const routing = useRoutes(routes(!!appState.authUser))

  useEffect(() => {
    if (initialized) return
    initialized = true

    if (appGetRefreshToken() === '') {
      setLoading(false)
      return
    }

    fetchAccessToken()
      .then(({ accessToken }) => {
        const failed = accessToken.token === undefined || accessToken.exp === undefined

        if (failed) throw new Error()

        appSetAuthToken(accessToken.token, accessToken.exp)

        return fetchAuthUser()
      })
      .then((user: User) => {
        appSetAuthUser(user)
      })
      .catch(() => {
        appSetLogout()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [appGetRefreshToken, appSetLogout, appSetAuthToken, appSetAuthUser])

  if (loading)
    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center justify-content-center">
        <CSpinner color="info" style={{ width: '4rem', height: '4rem' }} />
      </div>
    )

  return <div className="wrapper">{routing}</div>
}

export default App
