import React from 'react'
import { Navigate } from 'react-router-dom'

import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '*',
    element: <Navigate to="/404" />,
  },
]

export default routes
