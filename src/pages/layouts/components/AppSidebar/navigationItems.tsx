import CIcon from '@coreui/icons-react'
import {
  cilCalculator,
  cilCalendar,
  cilCursor,
  cilFile,
  cilLan,
  cilLockLocked,
  cilPuzzle,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const navigationItems = [
  {
    component: CNavItem,
    name: 'sidebar.dashboard',
    to: '/app/dashboard',
    icon: <CIcon content={cilSpeedometer} customClasses="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavItem,
    name: 'sidebar.reservations',
    to: '/app/reservations',
    icon: <CIcon content={cilCalendar} customClasses="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'sidebar.user_experiments',
    to: '/app/user-experiments',
    icon: <CIcon content={cilFile} customClasses="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'sidebar.settings',
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
  {
    component: CNavTitle,
    name: 'Category 2',
  },
  {
    component: CNavGroup,
    name: 'Item 3',
    to: '/404',
    icon: <CIcon content={cilPuzzle} customClasses="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Nested item',
        to: '/404',
        icon: <CIcon content={cilCursor} customClasses="nav-icon" />,
      },
    ],
  },
]

export default navigationItems
