import { CForm, CFormFloating, CFormInput, CFormLabel } from '@coreui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'

import { Role, CreateRoleInput, useCreateRoleMutation } from '__generated__/graphql'
import { ButtonSave, ErrorNotifier, SpinnerOverlay } from 'components'
import RoleFormPermissions from '../RoleFormPermissions'

interface Props {
  handleCreateRole?: (role: Role) => void
}

const CreateRoleForm = ({ handleCreateRole }: Props) => {
  const { t } = useTranslation()
  const [createRoleInput, setCreateRoleInput] = useState<CreateRoleInput>({
    name: '',
    permissions: [],
  })

  const [createRoleMutation, { loading, error }] = useCreateRoleMutation()

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault()

    await createRoleMutation({
      variables: {
        createRoleInput,
      },
    })
      .then((data: any) => {
        if (data.data?.createRole) {
          toast.success(t('roles.create.success'))
          if (handleCreateRole) {
            handleCreateRole(data.data.updateUser)
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
          value={createRoleInput.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setCreateRoleInput({ ...createRoleInput, name: event.target.value })
          }
        />
        <CFormLabel>{t('roles.columns.name')}</CFormLabel>
      </CFormFloating>
      <RoleFormPermissions
        handleChange={(ids) => {
          setCreateRoleInput({ ...createRoleInput, permissions: ids })
        }}
      />
      <div className="text-right">
        <ButtonSave />
      </div>
    </CForm>
  )
}

export default CreateRoleForm
