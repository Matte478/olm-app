import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormFloating,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilUser } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { UpdateUserInput, useEditUserMutation, User } from '../../../../__generated__/graphql'
import { ErrorNotifier, SpinnerOverlay } from '../../../components'

interface Props {
  user: User
  handleUpdateUser?: (user: User) => void
}

const EditUserForm: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation()
  const [user, setUser] = useState(props.user)
  const [updateUserInput, setUpdateUserInput] = useState<UpdateUserInput>({
    id: props.user.id,
    name: props.user.name,
    email: props.user.email,
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
          setUser(data.data.updateUser)

          if (props.handleUpdateUser) props.handleUpdateUser(data.data.updateUser)
        }
      })
      .catch(() => {})
  }

  return (
    <CCard>
      {loading && <SpinnerOverlay transparent={true} />}
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <strong className="d-flex align-items-center justify-content-center">
          <CIcon content={cilUser} className="me-1" />
          {t('actions.edit')} {user.name}
        </strong>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleEdit}>
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

export default EditUserForm
