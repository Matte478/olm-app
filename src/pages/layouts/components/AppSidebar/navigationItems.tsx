import CIcon from '@coreui/icons-react'
import {
  cilCalculator,
  cilCalendar,
  cilFile,
  cilLan,
  cilLibraryAdd,
  cilLockLocked,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const navigationItems = [
  {
    component: CNavTitle,
    name: 'sidebar.lab',
  },
  {
    component: CNavItem,
    name: 'sidebar.dashboard',
    permission: 'user_experiment.create',
    to: '/app/dashboard',
    icon: <CIcon content={cilSpeedometer} customClasses="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'sidebar.queue',
    permission: 'user_experiment.create',
    to: '/app/queue',
    icon: <CIcon content={cilLibraryAdd} customClasses="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'sidebar.reservations',
    permission: 'reservation.show',
    to: '/app/reservations',
    icon: <CIcon content={cilCalendar} customClasses="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'sidebar.user_experiments',
    permission: ['user_experiment.show_own', 'user_experiment.show_all'],
    to: '/app/user-experiments',
    icon: <CIcon content={cilFile} customClasses="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'sidebar.settings-experiments',
    permission: ['server.show', 'schema.show'],
  },
  {
    component: CNavItem,
    name: 'sidebar.servers',
    permission: 'server.show',
    to: '/app/servers',
    icon: <CIcon content={cilLan} customClasses="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'sidebar.schemas',
    permission: 'schema.show',
    to: '/app/schemas',
    icon: <CIcon content={cilCalculator} customClasses="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'sidebar.settings',
    permission: ['user.show', 'role.show'],
  },
  {
    component: CNavItem,
    name: 'sidebar.users',
    permission: 'user.show',
    to: '/app/users',
    icon: <CIcon content={cilUser} customClasses="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'sidebar.roles',
    permission: 'role.show',
    to: '/app/roles',
    icon: <CIcon content={cilLockLocked} customClasses="nav-icon" />,
  },
]

export default navigationItems
