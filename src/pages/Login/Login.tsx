import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useLoginMutation, LoginInput } from '../../__generated__/graphql'
import { AppStateContext } from '../../provider'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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

const Login: React.FC = () => {
  const { appSetLogin, gqlError, appSetRefreshToken } = useContext(AppStateContext)
  const [login] = useLoginMutation()

  const [loginInput, setLoginInput] = useState<LoginInput>({
    username: '',
    password: '',
  })
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setShow(false)
      const { data } = await login({
        variables: {
          loginInput,
        },
      })
      if (data === undefined || data?.login === undefined || data.login?.access_token === undefined)
        throw new Error('Invalid credentials')

      appSetRefreshToken(data?.login.refresh_token || '')
      appSetLogin(data?.login.access_token!, data?.login.expires_in!)

      navigate('/')
    } catch {
      setShow(true)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol lg={8} md={12}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
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
                        placeholder="Username"
                        autoComplete="username"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                          setLoginInput({ ...loginInput, username: event.target.value })
                        }
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon content={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                          setLoginInput({ ...loginInput, password: event.target.value })
                        }
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5">
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="light" className="mt-3" tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
