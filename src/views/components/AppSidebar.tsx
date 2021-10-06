import React, { useState } from 'react'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import { AppSidebarNav } from './AppSidebarNav'

import './AppSidebar.scss'

import navigation from '../../_nav'

interface Props {
  visible: boolean
}

const AppSidebar: React.FC<Props> = ({ visible }: Props) => {
  const { t } = useTranslation()
  const [narrow, setNarrow] = useState(false)

  return (
    <CSidebar position="fixed" unfoldable={false} narrow={narrow} visible={visible}>
      <CSidebarBrand className="d-none d-md-flex text-uppercase">
        {narrow ? (
          <span>{t('navbar-app.acronym')}</span>
        ) : (
          <span className="text-uppercase text-center" style={{maxWidth: '200px'}}>
            {t('navbar-app.title')}
          </span>
        )}
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar autoHide={false} style={{ maxHeight: '100%' }}>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler className="d-none d-lg-flex" onClick={() => setNarrow(!narrow)} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
