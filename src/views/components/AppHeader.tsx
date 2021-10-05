import React from 'react'
import { CContainer, CHeader, CHeaderNav, CHeaderToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import AppHeaderDropdown from './AppHeaderDropdown'

interface Props {
  changeSidebarVisibility: () => void
}

const AppHeader: React.FC<Props> = ({ changeSidebarVisibility }: Props) => {
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler className="ps-1" onClick={changeSidebarVisibility}>
          <CIcon content={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
