import React from 'react'
import { Navigate } from 'react-router-dom'

// layout
import AppLayout from 'pages/layouts/AppLayout'
import MainLayout from 'pages/layouts/MainLayout'

// permissions
import { Can } from 'components'

// auth
import Login from 'pages/auth/Login'
import Register from 'pages/auth/Register'

// error
import Error404 from 'pages/errors/Error404'
import Error500 from 'pages/errors/Error500'

// dashboard
import Dashboard from 'pages/app/dashboard'

// users
import IndexUser from 'pages/app/users/index'
import EditUser from 'pages/app/users/edit'
import UpdateProfile from 'pages/app/users/update-profile'
import UpdatePassword from 'pages/app/users/update-password'

// roles
import IndexRole from 'pages/app/roles/index'
import CreateRole from 'pages/app/roles/create'
import EditRole from 'pages/app/roles/edit'

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
        path: '/profile',
        element: <UpdateProfile />,
      },
      {
        path: '/update-password',
        element: <UpdatePassword />,
      },
      {
        path: '/users',
        children: [
          {
            path: '/',
            element: (
              <Can permission="user.index" notify={true}>
                <IndexUser />
              </Can>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <Can permission="user.edit" notify={true}>
                <EditUser />
              </Can>
            ),
          },
        ],
      },
      {
        path: '/roles',
        children: [
          {
            path: '/',
            element: (
              <Can permission="role.index" notify={true}>
                <IndexRole />
              </Can>
            ),
          },
          {
            path: '/create',
            element: (
              <Can permission="role.create" notify={true}>
                <CreateRole />
              </Can>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <Can permission="role.edit" notify={true}>
                <EditRole />
              </Can>
            ),
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
