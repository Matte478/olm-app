import React from 'react'
import { Navigate } from 'react-router-dom'

// layout
import AppLayout from './views/layouts/AppLayout'
import MainLayout from './views/layouts/MainLayout'

// auth
import Login from './views/pages/auth/Login'
import Register from './views/pages/auth/Register'

// error
import Error404 from './views/pages/errors/Error404'

// app
import Dashboard from './views/pages/app/Dashboard'
import Error500 from './views/pages/errors/Error500'

// users
import UserIndex from './views/pages/app/user/Index'

const routes = (loggedIn: boolean) => [
  {
    path: '/',
    element: !loggedIn ? <MainLayout /> : <Navigate to="/app" />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" />,
      },
      {
        path: '/login',
        element: !loggedIn ? <Login /> : <Navigate to="/" />,
      },
      {
        path: '/register',
        element: !loggedIn ? <Register /> : <Navigate to="/" />,
      },
    ],
  },
  {
    path: '/app',
    element: loggedIn ? <AppLayout /> : <Navigate to="/" />,
    children: [
      {
        path: '/',
        element: <Navigate to="/app/dashboard" />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/users',
        children: [
          {
            path: '/',
            element: <UserIndex />,
          },
        ],
      },
    ],
  },
  {
    path: '/500',
    element: <Error500 />,
  },
  {
    path: '*',
    element: <Error404 />,
  },
]

export default routes
