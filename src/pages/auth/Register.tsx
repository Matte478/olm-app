import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import { RegisterInput, useRegisterMutation } from '__generated__/graphql'
import { ErrorNotifier, SpinnerOverlay } from 'components'

const Register: React.FC = () => {
  const { t } = useTranslation()
  const [register, { loading, error }] = useRegisterMutation()

  const [registerInput, setRegisterInput] = useState<RegisterInput>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const navigate = useNavigate()

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const { data } = await register({
        variables: {
          registerInput,
        },
      })
      if (data === undefined || data?.register === undefined) throw new Error('Invalid credentials')
      navigate('/login')
    } catch (error) {}
  }

  return (
    <div className="min-vh-100-nav py-3 d-flex flex-row align-items-center bg-light">
      {loading && <SpinnerOverlay transparent={true} />}
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}>
                  <h1>{t('register.title')}</h1>
                  <p className="text-medium-emphasis">{t('register.description')}</p>
                  <ErrorNotifier error={error} />
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
