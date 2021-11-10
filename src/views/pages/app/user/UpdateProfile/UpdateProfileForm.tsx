import React, { useState } from 'react'
import { CForm, CFormFloating, CFormInput, CFormLabel } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import {
  AuthenticatedUserFragment,
  ProfileFragment,
  UpdateUserInput,
  useUpdateProfileMutation,
} from '../../../../../__generated__/graphql'
import { ButtonSave, ErrorNotifier, SpinnerOverlay } from '../../../../components'

interface Props {
  user: ProfileFragment
  handleUpdateUser?: (user: AuthenticatedUserFragment) => void
}

const UpdateProfileForm: React.FC<Props> = ({ user, handleUpdateUser }: Props) => {
  const { t } = useTranslation()
  const [updateUserInput, setUpdateUserInput] = useState<UpdateUserInput>({
    id: user.id,
    name: user.name,
    email: user.email,
  })
  const [updateProfileMutation, { loading, error }] = useUpdateProfileMutation()

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault()

    await updateProfileMutation({
      variables: {
        updateUserInput,
      },
    })
      .then((data) => {
        if (data.data?.updateUser) {
          toast.success(t('users.update.success'))
          if (handleUpdateUser) {
            handleUpdateUser(data.data.updateUser)
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
          value={updateUserInput.name || ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUpdateUserInput({ ...updateUserInput, name: event.target.value })
          }
        />
        <CFormLabel>{t('users.columns.name')}</CFormLabel>
      </CFormFloating>

      <CFormFloating className="mb-3">
        <CFormInput
          type="email"
          id="email"
          value={updateUserInput?.email || ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUpdateUserInput({ ...updateUserInput, email: event.target.value })
          }
        />
        <CFormLabel>{t('users.columns.email')}</CFormLabel>
      </CFormFloating>

      <div className="text-right">
        <ButtonSave />
      </div>
    </CForm>
  )
}

export default UpdateProfileForm
