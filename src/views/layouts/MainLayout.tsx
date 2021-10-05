import { CCol, CContainer, CHeader, CRow } from '@coreui/react'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <CHeader className="position-fixed w-100 z-index-100" position="fixed">
        <CContainer>
          <CRow className="w-100">
            <CCol xs="12">
              <header className="d-flex flex-row justify-content-between align-items-center">
                <Link to="/" className="text-decoration-none text-dark">
                  <h6 className="mb-0 text-uppercase">Online labaratory manager</h6>
                </Link>
                <nav className="d-flex flex-row">
                  <div className="me-2">
                    <Link to="/login" className="text-decoration-none text-dark">
                      Login
                    </Link>
                  </div>
                  <div className="ms-2">
                    <Link to="/register" className="text-decoration-none text-dark">
                      Register
                    </Link>
                  </div>
                </nav>
              </header>
            </CCol>
          </CRow>
        </CContainer>
      </CHeader>

      <main className="p-main">
        <Outlet />
      </main>
    </React.Fragment>
  )
}

export default Layout
