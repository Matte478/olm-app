import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormFloating,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import { cilLockLocked, cilSave } from '@coreui/icons'
import {
  UpdatePassword as UpdatePasswordInput,
  useUpdatePasswordMutation,
} from '../../../../__generated__/graphql'
import { ErrorNotifier, SpinnerOverlay } from '../../../components'

const UpdatePassword = () => {
  const { t } = useTranslation()

  const initialUpdatePasswordInput: UpdatePasswordInput = {
    old_password: '',
    password: '',
    password_confirmation: '',
  }

  const [updatePasswordInput, setUpdatePasswordInput] = useState(initialUpdatePasswordInput)
  const [updatePasswordMutation, { data, loading, error }] = useUpdatePasswordMutation()

  const handleUpdatePassowrd = async (event: React.FormEvent) => {
    event.preventDefault()

    await updatePasswordMutation({
      variables: {
        updatePasswordInput,
      },
    })
      .then(() => setUpdatePasswordInput(initialUpdatePasswordInput))
      .catch(() => {})
  }

  return (
    <CCard>
      {loading && <SpinnerOverlay transparent={true} />}
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <strong className="d-flex align-items-center justify-content-center">
          <CIcon content={cilLockLocked} className="me-1" />
          {t('update-password.index.title')}
        </strong>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleUpdatePassowrd}>
          <ErrorNotifier error={error} />
          {data?.updatePassword.message && (
            <CAlert color="success" className="py-2">
              {data.updatePassword.message}
            </CAlert>
          )}
          <CFormFloating className="mb-3">
            <CFormInput
              type="password"
              id="old_password"
              value={updatePasswordInput.old_password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setUpdatePasswordInput({ ...updatePasswordInput, old_password: event.target.value })
              }
            />
            <CFormLabel>{t('update-password.columns.old_password')}</CFormLabel>
          </CFormFloating>

          <CFormFloating className="mb-3">
            <CFormInput
              type="password"
              id="password"
              value={updatePasswordInput.password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setUpdatePasswordInput({ ...updatePasswordInput, password: event.target.value })
              }
            />
            <CFormLabel>{t('update-password.columns.password')}</CFormLabel>
          </CFormFloating>

          <CFormFloating className="mb-3">
            <CFormInput
              type="password"
              id="password_confirmation"
              value={updatePasswordInput.password_confirmation}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setUpdatePasswordInput({
                  ...updatePasswordInput,
                  password_confirmation: event.target.value,
                })
              }
            />
            <CFormLabel>{t('update-password.columns.password_confirmation')}</CFormLabel>
          </CFormFloating>
          <div className="text-right">
            <CButton
              type="submit"
              className="d-inline-flex justify-content-center align-items-center"
              color="primary"
            >
              <CIcon content={cilSave} className="me-1" />
              {t('actions.save')}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default UpdatePassword
