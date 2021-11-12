import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import navigationItems from './navigationItems'
import AppSidebarNav from './AppSidebarNav'

import './AppSidebar.scss'

interface Props {
  visible: boolean
}

const AppSidebar: React.FC<Props> = ({ visible }: Props) => {
  const { t } = useTranslation()
  const [narrow, setNarrow] = useState(false)

  return (
    <CSidebar position="fixed" unfoldable={false} narrow={narrow} visible={visible}>
      <CSidebarBrand className="d-none d-md-flex text-uppercase">
        <span className="text-uppercase text-center" style={{ maxWidth: '200px' }}>
          {narrow ? t('navbar-app.acronym') : t('navbar-app.title')}
        </span>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar autoHide={false} style={{ maxHeight: '100%' }}>
          <AppSidebarNav navigationItems={navigationItems} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler className="d-none d-lg-flex" onClick={() => setNarrow(!narrow)} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
