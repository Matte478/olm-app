import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CButton, CCol, CContainer, CRow } from '@coreui/react'

const Error404: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol>
            <div className="d-flex justify-content-center flex-column flex-sm-row text-center text-sm-left">
              <h1 className="display-3 me-sm-4">404</h1>
              <div>
                <h4 className="pt-2">{t('page404.title')}</h4>
                <p className="text-medium-emphasis">{t('page404.description')}</p>
                <Link to="/">
                  <CButton>{t('page404.button')}</CButton>
                </Link>
              </div>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Error404
