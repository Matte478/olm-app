import React, { useState } from 'react'
import { CForm, CFormFloating, CFormInput, CFormLabel } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'

import {
  AuthenticatedUserFragment,
  ProfileFragment,
  UpdateProfileInput,
  useUpdateProfileMutation,
} from '__generated__/graphql'
import { ButtonSave, ErrorNotifier, SpinnerOverlay } from 'components'

interface Props {
  user: ProfileFragment
  handleUpdateProfile?: (user: AuthenticatedUserFragment) => void
}

const UpdateProfileForm: React.FC<Props> = ({ user, handleUpdateProfile }: Props) => {
  const { t } = useTranslation()
  const [updateProfileInput, setUpdateProfileInput] = useState<UpdateProfileInput>({
    name: user.name,
    email: user.email,
  })
  const [updateProfileMutation, { loading, error }] = useUpdateProfileMutation()

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault()

    await updateProfileMutation({
      variables: {
        updateProfileInput,
      },
    })
      .then((data) => {
        if (data.data?.updateProfile) {
          toast.success(t('update-profile.update.success'))
          if (handleUpdateProfile) {
            handleUpdateProfile(data.data.updateProfile)
          }
        }
      })
      .catch(() => {})
  }

  return (
    <CForm onSubmit={handleEdit}>
      {loading ? <SpinnerOverlay transparent={true} /> : <></>}
      <ErrorNotifier error={error} />
      <CFormFloating className="mb-3">
        <CFormInput
          type="text"
          id="name"
          value={updateProfileInput.name || ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUpdateProfileInput({ ...updateProfileInput, name: event.target.value })
          }
        />
        <CFormLabel>{t('update-profile.columns.name')}</CFormLabel>
      </CFormFloating>

      <CFormFloating className="mb-3">
        <CFormInput
          type="email"
          id="email"
          value={updateProfileInput?.email || ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUpdateProfileInput({ ...updateProfileInput, email: event.target.value })
          }
        />
        <CFormLabel>{t('update-profile.columns.email')}</CFormLabel>
      </CFormFloating>

      <div className="text-right">
        <ButtonSave />
      </div>
    </CForm>
  )
}

export default UpdateProfileForm
