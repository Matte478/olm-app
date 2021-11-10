import React from 'react'
import { Navigate } from 'react-router-dom'

// layout
import AppLayout from './views/layouts/AppLayout'
import MainLayout from './views/layouts/MainLayout'

// wrapper
import Can from './views/components/Can/Can'

// auth
import Login from './views/pages/auth/Login'
import Register from './views/pages/auth/Register'

// error
import Error404 from './views/pages/errors/Error404'
import Error500 from './views/pages/errors/Error500'

// app
import Dashboard from './views/pages/app/Dashboard'

// users
import IndexUser from './views/pages/app/user/index/IndexUser'
import EditUser from './views/pages/app/user/edit/EditUser'
import UpdateProfile from './views/pages/app/user/UpdateProfile/UpdateProfile'
import UpdatePassword from './views/pages/app/user/UpdatePassword/UpdatePassword'

// roles
import IndexRole from './views/pages/app/role/index/IndexRole'
import CreateRole from './views/pages/app/role/create/CreateRole'
import EditRole from './views/pages/app/role/edit/EditRole'

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
