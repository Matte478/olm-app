import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useTranslation } from 'react-i18next'

import { RegisterInput, useRegisterMutation } from '../../../__generated__/graphql'
import { AppStateContext } from '../../../provider'

const Register: React.FC = () => {
  const { t } = useTranslation()
  const { gqlError } = useContext(AppStateContext)
  const [register] = useRegisterMutation()

  const [registerInput, setRegisterInput] = useState<RegisterInput>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setShow(false)
      const { data } = await register({
        variables: {
          registerInput,
        },
      })
      if (data === undefined || data?.register === undefined) throw new Error('Invalid credentials')
      navigate('/login')
    } catch (error) {
      setShow(true)
    }
  }

  return (
    <div className="min-vh-100-nav py-3 d-flex flex-row align-items-center bg-light">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}>
                  <h1>{t('register.title')}</h1>
                  <p className="text-medium-emphasis">{t('register.description')}</p>
                  {show ? (
                    <CAlert color="danger" className="py-2">
                      {gqlError.msg}
                    </CAlert>
                  ) : (
                    ''
                  )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon content={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder={t('register.form.name')}
                      autoComplete="name"
                      value={registerInput.name}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setRegisterInput({ ...registerInput, name: event.target.value })
                      }
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder={t('register.form.email')}
                      autoComplete="email"
                      value={registerInput.email}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setRegisterInput({ ...registerInput, email: event.target.value })
                      }
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon content={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder={t('register.form.password')}
                      autoComplete="new-password"
                      value={registerInput.password}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setRegisterInput({ ...registerInput, password: event.target.value })
                      }
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon content={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder={t('register.form.password-confirm')}
                      autoComplete="new-password"
                      value={registerInput.password_confirmation}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setRegisterInput({
                          ...registerInput,
                          password_confirmation: event.target.value,
                        })
                      }
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="primary">
                      {t('register.form.button')}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
