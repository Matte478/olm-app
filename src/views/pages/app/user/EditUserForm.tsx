import React, { useState } from 'react'
import { CForm, CFormFloating, CFormInput, CFormLabel } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import Select from 'react-select'
import {
  UpdateUserInput,
  useEditUserMutation,
  User,
  useRolesQuery,
} from '../../../../__generated__/graphql'
import { ButtonSave, ErrorNotifier, SpinnerOverlay } from '../../../components'

interface Props {
  user: User
  withRoles?: boolean
  handleUpdateUser?: (user: User) => void
}

const EditUserForm: React.FC<Props> = ({ user, withRoles = true, handleUpdateUser }: Props) => {
  const { t } = useTranslation()
  const { data: rolesData, loading: rolesLoading, error: rolesError } = useRolesQuery()
  const [updateUserInput, setUpdateUserInput] = useState<UpdateUserInput>({
    id: user.id,
    name: user.name,
    email: user.email,
    roles: withRoles ? user.roles.map((role) => role.name) : undefined,
  })
  const [editUserMutation, { loading, error }] = useEditUserMutation()

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault()

    await editUserMutation({
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
      {loading || rolesLoading ? <SpinnerOverlay transparent={true} /> : <></>}
      <ErrorNotifier error={error || rolesError} />
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

      {withRoles && (
        <>
          <label>{t('users.columns.roles')}</label>
          <Select
            className="mb-3"
            options={rolesData?.roles.map((role) => {
              return {
                value: role.name,
                label: role.name,
              }
            })}
            value={updateUserInput.roles?.map((roleName) => {
              return {
                value: roleName,
                label: roleName,
              }
            })}
            isMulti
            onChange={(input) =>
              setUpdateUserInput({ ...updateUserInput, roles: input.map((i) => i.value) })
            }
          />
        </>
      )}

      <div className="text-right">
        <ButtonSave />
      </div>
    </CForm>
  )
}

export default EditUserForm
