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

// reservations
import Reservation from 'pages/app/reservations'

// servers
import IndexServer from 'pages/app/servers/index'
import CreateServer from 'pages/app/servers/create'
import EditServer from 'pages/app/servers/edit'
import ShowServer from 'pages/app/servers/show'

// schemas
import IndexSchema from 'pages/app/schemas/index'
import CreateSchema from 'pages/app/schemas/create'
import EditSchema from 'pages/app/schemas/edit'

// user experiments
import IndexUserExperiment from 'pages/app/user-experiments/index'
import ShowUserExperiment from 'pages/app/user-experiments/show'

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

        element: (
          <Can permission="user_experiment.create" notify={false}>
            <Navigate to="/app/dashboard" />
          </Can>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <Can permission="user_experiment.create" notify={true}>
            <Dashboard />
          </Can>
        ),
      },
      {
        path: '/update-profile',
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
              <Can permission="user.show" notify={true}>
                <IndexUser />
              </Can>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <Can permission="user.update" notify={true}>
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
              <Can permission="role.show" notify={true}>
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
              <Can permission="role.update" notify={true}>
                <EditRole />
              </Can>
            ),
          },
        ],
      },
      {
        path: '/reservations',
        element: (
          <Can permission="reservation.show" notify={true}>
            <Reservation />
          </Can>
        ),
      },
      {
        path: '/servers',
        children: [
          {
            path: '/',
            element: (
              <Can permission="server.show" notify={true}>
                <IndexServer />
              </Can>
            ),
          },
          {
            path: '/create',
            element: (
              <Can permission="server.create" notify={true}>
                <CreateServer />
              </Can>
            ),
          },
          {
            path: ':id/show',
            element: (
              <Can permission="server.show" notify={true}>
                <ShowServer />
              </Can>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <Can permission="server.update" notify={true}>
                <EditServer />
              </Can>
            ),
          },
        ],
      },
      {
        path: '/schemas',
        children: [
          {
            path: '/',
            element: (
              <Can permission="schema.show" notify={true}>
                <IndexSchema />
              </Can>
            ),
          },
          {
            path: '/create',
            element: (
              <Can permission="schema.create" notify={true}>
                <CreateSchema />
              </Can>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <Can permission="schema.update" notify={true}>
                <EditSchema />
              </Can>
            ),
          },
        ],
      },
      {
        path: '/user-experiments',
        children: [
          {
            path: '/',
            element: (
              <Can
                permission={['user_experiment.show_all', 'user_experiment.show_own']}
                notify={true}
              >
                <IndexUserExperiment />
              </Can>
            ),
          },
          {
            path: ':id/show',
            element: (
              <Can
                permission={['user_experiment.show_all', 'user_experiment.show_own']}
                notify={true}
              >
                <ShowUserExperiment />
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
