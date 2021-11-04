import { CForm, CFormFloating, CFormInput, CFormLabel } from '@coreui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import {
  Permission,
  Role,
  UpdateRoleInput,
  useUpdateRoleMutation,
} from '../../../../__generated__/graphql'
import { ButtonSave, ErrorNotifier, SpinnerOverlay } from '../../../components'
import RoleFormPermissions from './RoleFormPermissions'

interface Props {
  role: Role
  handleUpdateRole?: (role: Role) => void
}

const EditRoleForm = ({ role, handleUpdateRole }: Props) => {
  const { t } = useTranslation()
  const [updateRoleInput, setUpdateRoleInput] = useState<UpdateRoleInput>({
    id: role.id,
    name: role.name,
    permissions: role.permissions.map((permission: Permission) => permission.id),
  })

  const [editRoleMutation, { loading, error }] = useUpdateRoleMutation()

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault()

    await editRoleMutation({
      variables: {
        updateRoleInput,
      },
    })
      .then((data: any) => {
        if (data.data?.updateRole) {
          toast.success(t('roles.update.success'))
          if (handleUpdateRole) {
            handleUpdateRole(data.data.updateUser)
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
          value={updateRoleInput.name || ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUpdateRoleInput({ ...updateRoleInput, name: event.target.value })
          }
        />
        <CFormLabel>{t('roles.columns.name')}</CFormLabel>
      </CFormFloating>
      <RoleFormPermissions
        preselected={updateRoleInput.permissions || []}
        handleChange={(ids) => {
          setUpdateRoleInput({ ...updateRoleInput, permissions: ids })
        }}
      />
      <div className="text-right">
        <ButtonSave />
      </div>
    </CForm>
  )
}

export default EditRoleForm
