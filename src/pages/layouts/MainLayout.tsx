import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { CCol, CContainer, CHeader, CHeaderNav, CRow } from '@coreui/react'
import { useTranslation } from 'react-i18next'

import { LanguageDropdown } from 'components'

const Layout: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <CHeader className="position-fixed w-100 z-index-100" position="fixed">
        <CContainer>
          <CRow className="w-100">
            <CCol xs="12">
              <header className="d-flex flex-row justify-content-between align-items-center">
                <Link to="/" className="text-decoration-none text-dark">
                  <h6 className="mb-0 text-uppercase">{t('navbar.title')}</h6>
                </Link>
                <CHeaderNav className="d-flex flex-row">
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link text-decoration-none text-dark">
                      {t('navbar.login')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link text-decoration-none text-dark">
                      {t('navbar.register')}
                    </NavLink>
                  </li>
                  <LanguageDropdown />
                </CHeaderNav>
              </header>
            </CCol>
          </CRow>
        </CContainer>
      </CHeader>

      <main className="p-main">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
