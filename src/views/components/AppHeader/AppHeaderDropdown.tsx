import React, { useContext } from 'react'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useTranslation } from 'react-i18next'

import { AppStateContext } from '../../../provider'
import AppHeaderDropdownLogout from './AppHeaderDropdownLogout'

const AppHeaderDropdown: React.FC = () => {
  const { appState } = useContext(AppStateContext)
  const { t } = useTranslation()

  return (
    <CDropdown component="li" variant="nav-item" placement="bottom-end">
      <CDropdownToggle className="py-2">{appState.authUser!.name}</CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          {t('navbar-app.settings')}
        </CDropdownHeader>
        <CDropdownItem href="/app/users/profile">
          <CIcon content={cilUser} className="me-2" />
          {t('navbar-app.profile')}
        </CDropdownItem>
        <CDropdownItem href="/app/users/update-password">
          <CIcon content={cilLockLocked} className="me-2" />
          {t('navbar-app.update-password')}
        </CDropdownItem>
        <CDropdownDivider />
        <AppHeaderDropdownLogout />
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
