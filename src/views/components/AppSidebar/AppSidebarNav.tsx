import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { SidebarNavItem, SidebarNavItemBadge } from '../../../types'
import { useTranslation } from 'react-i18next'

interface Props {
  navigationItems: SidebarNavItem[]
}

const AppSidebarNav: React.FC<Props> = ({ navigationItems }: Props) => {
  const location = useLocation()
  const { t } = useTranslation()

  const navLink = (name: string, icon?: CIcon, badge?: SidebarNavItemBadge) => {
    return (
      <>
        {icon && icon}
        {name && t(name)}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item: SidebarNavItem, index: number) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
            activeClassName: 'active',
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    )
  }
  const navGroup = (item: SidebarNavItem, index: number) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon, undefined)}
        visible={to && location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item: SidebarNavItem, index: number) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    )
  }

  return (
    <React.Fragment>
      {navigationItems.map((item: SidebarNavItem, index: number) =>
        item.items ? navGroup(item, index) : navItem(item, index),
      )}
    </React.Fragment>
  )
}

export default AppSidebarNav
