import React, { useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import './AppSidebar.scss'

import navigation from '../../_nav'

interface Props {
  visible: boolean
}

const AppSidebar: React.FC<Props> = ({ visible }: Props) => {
  const [narrow, setNarrow] = useState(false)

  return (
    <CSidebar position="fixed" unfoldable={false} narrow={narrow} visible={visible}>
      <CSidebarBrand className="d-none d-md-flex text-uppercase">
        {narrow ? (
          <span>OLM</span>
        ) : (
          <span className="text-uppercase text-center">
            Online laboratory <br />
            manager
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
