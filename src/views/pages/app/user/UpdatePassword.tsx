import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CForm, CFormFloating, CFormInput, CFormLabel } from '@coreui/react'
import { cilLockLocked } from '@coreui/icons'
import { toast } from 'react-toast'
import {
  UpdatePassword as UpdatePasswordInput,
  useUpdatePasswordMutation,
} from '../../../../__generated__/graphql'
import { AppCard, ButtonSave, ErrorNotifier, SpinnerOverlay } from '../../../components'

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
      .then(() => {
        setUpdatePasswordInput(initialUpdatePasswordInput)
        toast.success(t('update-password.actions.success'))
      })
      .catch(() => {})
  }

  return (
    <AppCard icon={cilLockLocked} title={t('update-password.index.title')}>
      {loading ? <SpinnerOverlay transparent={true} /> : <></>}
      <CForm onSubmit={handleUpdatePassowrd}>
        <ErrorNotifier error={error} />
        <CFormFloating className="mb-3">
          <CFormInput
            type="password"
            id="old_password"
            value={updatePasswordInput.old_password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setUpdatePasswordInput({
                ...updatePasswordInput,
                old_password: event.target.value,
              })
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
          <ButtonSave />
        </div>
      </CForm>
    </AppCard>
  )
}

export default UpdatePassword
