import React, { useState, useEffect, useContext } from 'react'
import { Link, Navigate, Route, Routes, useRoutes } from 'react-router-dom'
import { AppStateContext, fetchAccessToken } from './provider'
import './scss/style.scss'

// import routes from './routes'

import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import { CSpinner } from '@coreui/react'

let initialized = false
const App = () => {
  const [loading, setLoading] = useState(true)
  const { appState, appSetLogin, appSetLogout, appGetRefreshToken } = useContext(AppStateContext)
  // const routing = useRoutes(routes)
  // return <div className="wrapper">{routing}</div>
  // const routing = useRoutes(routes)

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

  return (
    <div>
      <header>
        {appState.loggedIn ? (
          <div>
            <div>
              <Link to="/">Home</Link>
            </div>            
          </div>
        ) : (
          <div>
            <div>
              <Link to="/">Home</Link>
            </div>
            <div>
              <Link to="/register">Register</Link>
            </div>
            <div>
              <Link to="/login">Login</Link>
            </div>
          </div>
        )}
      </header>

      <Routes>
        <Route path="/">{appState.loggedIn ? <Dashboard /> : <Navigate to="/login" />}</Route>
        <Route path="/login">{appState.loggedIn ? <Navigate to="/" /> : <Login />}</Route>
        <Route path="/register">{appState.loggedIn ? <Navigate to="/" /> : <Register />}</Route>
      </Routes>

      {/* <div className="wrapper">
          {routing}
        </div> */}
    </div>
  )
}

export default App
