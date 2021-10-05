import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilCursor,
  cilDrop,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/app/dashboard',
    icon: <CIcon content={cilSpeedometer} customClasses="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Category 1',
  },
  {
    component: CNavItem,
    name: 'Item 1',
    to: '/404',
    icon: <CIcon content={cilDrop} customClasses="nav-icon" />,
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

export default _nav
