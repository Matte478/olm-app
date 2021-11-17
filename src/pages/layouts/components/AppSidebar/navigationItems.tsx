import CIcon from '@coreui/icons-react'
import {
  cilCalendar,
  cilCursor,
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
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'sidebar.reservations',
    to: '/app/reservations',
    icon: <CIcon content={cilCalendar} customClasses="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'sidebar.settings',
  },
  {
    component: CNavItem,
    name: 'sidebar.users',
    permission: 'user.index',
    to: '/app/users',
    icon: <CIcon content={cilUser} customClasses="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'sidebar.roles',
    permission: 'role.index',
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
