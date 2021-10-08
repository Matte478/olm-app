import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CDropdownItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { useTranslation } from 'react-i18next'

import { AppStateContext } from '../../../provider'
import { useLogoutMutation } from '../../../__generated__/graphql'

const AppHeaderDropdownLogout: React.FC = () => {
  const { appSetLogout } = useContext(AppStateContext)
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const logoutHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    logout().then(() => {
      appSetLogout()

      navigate('/login')
    })
  }

  return (
    <CDropdownItem component="button" onClick={logoutHandler}>
      <CIcon content={cilLockLocked} className="me-2" />
      {t('navbar-app.logout')}
    </CDropdownItem>
  )
}

export default AppHeaderDropdownLogout
