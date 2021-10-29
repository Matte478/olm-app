import React, { useContext, useState } from 'react'
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
import CIcon from '@coreui/icons-react'
import { cilSave, cilUser } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { UpdateUserInput, useEditUserMutation, User } from '../../../../__generated__/graphql'
import { AppStateContext } from '../../../../provider'

interface Props {
  user: User
}

const EditUserForm: React.FC<Props> = (props: Props) => {
  const { gqlError } = useContext(AppStateContext)
  const { t } = useTranslation()
  const [user, setUser] = useState(props.user)
  const [showError, setShowError] = useState(false)
  const [updateUserInput, setUpdateUserInput] = useState<UpdateUserInput>({
    id: props.user.id,
    name: props.user.name,
    email: props.user.email,
  })
  const [editUserMutation, { data, loading, error }] = useEditUserMutation()

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault()
    setShowError(false)
    await editUserMutation({
      variables: {
        updateUserInput,
      },
    })
      .then((data) => {
        if (data.data?.updateUser) setUser(data.data.updateUser)
      })
      .catch((err) => {
        setShowError(true)
      })
  }

  // console.log(data, loading, error, showError)

  return (
    <CCard>
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <strong className="d-flex align-items-center justify-content-center">
          <CIcon content={cilUser} className="me-1" />
          {t('actions.edit')} {user.name}
        </strong>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleEdit}>
          {loading && 'loading'}
          {showError && (
            <CAlert color="danger" className="py-2">
              {gqlError.msg}
            </CAlert>
          )}

          <CFormFloating className="mb-3">
            <CFormInput
              type="text"
              id="name"
              value={updateUserInput.name || ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                console.log(updateUserInput)
                setUpdateUserInput({ ...updateUserInput, name: event.target.value })
              }}
            />
            <CFormLabel>Name</CFormLabel>
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
            <CFormLabel>E-mail</CFormLabel>
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
