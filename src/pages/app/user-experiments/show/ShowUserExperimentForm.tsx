import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CForm, CFormFloating, CFormLabel, CFormTextarea } from '@coreui/react'
import { toast } from 'react-toast'

import { useUpdateUserExperimentMutation } from '__generated__/graphql'
import { ButtonSave, ErrorNotifier, SpinnerOverlay } from 'components'

type Props = {
  id: string
  note?: string | null
  disabled?: boolean
}

const ShowUserExperimentForm: React.FC<Props> = ({ id, note = null, disabled = false }: Props) => {
  const { t } = useTranslation()
  const [updateUserExperimentInput, setUpdateUserExperimentInput] = useState({
    id,
    note,
  })

  const [editUserExperimentMutation, { loading, error }] = useUpdateUserExperimentMutation()

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (disabled) return

    await editUserExperimentMutation({
      variables: {
        updateUserExperimentInput,
      },
    })
      .then((data) => {
        if (data.data?.updateUserExperiment) {
          toast.success(t('user_experiments.update.success'))
        }
      })
      .catch(() => {
        toast.error(t('user_experiments.update.error'))
      })
  }

  return (
    <CForm onSubmit={handleEdit}>
      {loading && <SpinnerOverlay transparent={true} />}
      <ErrorNotifier error={error} />
      <CFormFloating className="mb-3">
        <CFormTextarea
          type="password"
          id="old_password"
          style={{ height: '150px' }}
          value={updateUserExperimentInput.note || ''}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setUpdateUserExperimentInput({
              ...updateUserExperimentInput,
              note: event.target.value || null,
            })
          }}
          disabled={disabled}
        />
        <CFormLabel>{t('user_experiments.columns.note')}</CFormLabel>
      </CFormFloating>

      <div className="text-right">
        <ButtonSave disabled={disabled} />
      </div>
    </CForm>
  )
}

export default ShowUserExperimentForm
