import React from 'react'
import { CButton, CCol, CContainer, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'

const Error500: React.FC = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol>
            <div className="d-flex justify-content-center flex-column flex-sm-row text-center text-sm-left">
              <h1 className="display-3 me-sm-4">500</h1>
              <div>
                <h4 className="pt-2">Houston, we have a&nbsp;problem!</h4>
                <p className="text-medium-emphasis">The page you are looking for is temporarily unavailable.</p>
                <Link to="/">
                  <CButton>Go to Home</CButton>
                </Link>
              </div>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Error500
