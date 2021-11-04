import React, { useState, useEffect, useContext } from 'react'
import { useRoutes } from 'react-router-dom'
import { ToastContainer } from 'react-toast'
import { AppStateContext, fetchAccessToken, fetchAuthUser } from './provider'
import routes from './routes'
import { User } from './__generated__/graphql'
import { SpinnerOverlay } from './views/components'
import './scss/style.scss'

let initialized = false
const App: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const {
    appState,
    appSetLogout,
    appSetAuthToken,
    appSetAuthUser,
    appGetRefreshToken,
  } = useContext(AppStateContext)
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

  if (loading) return <SpinnerOverlay />

  return (
    <div className="wrapper">
      {routing}

      <div className="app-toast">
        <ToastContainer delay={5000} position="bottom-right" />
      </div>
    </div>
  )
}

export default App
