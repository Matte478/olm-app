import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCursor, cilPencil, cilPuzzle, cilSpeedometer, cilUser } from '@coreui/icons'
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
    component: CNavTitle,
    name: 'sidebar.settings'
  },
  {
    component: CNavItem,
    name: 'sidebar.users',
    to: '/app/users',
    icon: <CIcon content={cilUser} customClasses="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Item 2',
    to: '/404',
    icon: <CIcon content={cilPencil} customClasses="nav-icon" />,
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