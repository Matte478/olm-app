import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

import { AppStateContext } from 'provider'
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
        <Link className="text-decoration-none" to="/app/profile">
          <CDropdownItem component="span">
            <CIcon content={cilUser} className="me-2" />
            {t('navbar-app.profile')}
          </CDropdownItem>
        </Link>
        <Link className="text-decoration-none" to="/app/update-password">
          <CDropdownItem component="span">
            <CIcon content={cilLockLocked} className="me-2" />
            {t('navbar-app.update-password')}
          </CDropdownItem>
        </Link>
        <CDropdownDivider />
        <AppHeaderDropdownLogout />
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
