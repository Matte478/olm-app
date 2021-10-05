import React, { useState, useEffect, useContext } from 'react'
import { Link, Navigate, Route, Routes, useRoutes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { AppStateContext, fetchAccessToken } from './provider'
import routes from './routes'
import './scss/style.scss'

let initialized = false
const App = () => {
  const [loading, setLoading] = useState(true)
  const { appState, appSetLogin, appSetLogout, appGetRefreshToken } = useContext(AppStateContext)
  const routing = useRoutes(routes(appState.loggedIn))

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
        failed ? appSetLogout() : appSetLogin(accessToken.token, accessToken.exp)
      })
      .catch(() => {
        appSetLogout()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [appGetRefreshToken, appSetLogout, appSetLogin])

  if (loading)
    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center justify-content-center">
        <CSpinner color="info" style={{ width: '4rem', height: '4rem' }} />
      </div>
    )

  return <div className="wrapper">{routing}</div>
}

export default App
