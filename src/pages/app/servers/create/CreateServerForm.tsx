import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import { CForm, CFormFloating, CFormInput, CFormLabel, CFormSwitch } from '@coreui/react'
import { ButtonSave, ErrorNotifier, SpinnerOverlay } from 'components'
import { CreateServerInput, useCreateServerMutation } from '__generated__/graphql'

interface Props {}

const CreateServerForm: React.FC<Props> = ({}: Props) => {
  const { t } = useTranslation()
  const [createServerInput, setCreateServerInput] = useState<CreateServerInput>({
    name: '',
    ip_address: '',
    port: 80,
    websocket_port: 3001,
    production: false,
    enabled: false,
  })
  const [createServerMutation, { loading, error }] = useCreateServerMutation()

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()

    await createServerMutation({
      variables: {
        createServerInput,
      },
    })
      .then((data) => {
        if (data.data?.createServer) {
          toast.success(t('servers.create.success'))
        }
      })
      .catch(() => {})
  }

  return (
    <CForm onSubmit={handleCreate}>
      {loading && <SpinnerOverlay transparent={true} />}
      <ErrorNotifier error={error} />
      <CFormFloating className="mb-3">
        <CFormInput
          type="text"
          id="name"
          value={createServerInput.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setCreateServerInput({ ...createServerInput, name: event.target.value })
          }
        />
        <CFormLabel>{t('servers.columns.name')}</CFormLabel>
      </CFormFloating>
      <CFormFloating className="mb-3">
        <CFormInput
          type="text"
          id="ip_address"
          value={createServerInput.ip_address}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setCreateServerInput({ ...createServerInput, ip_address: event.target.value })
          }
        />
        <CFormLabel>{t('servers.columns.ip_address')}</CFormLabel>
      </CFormFloating>
      <CFormFloating className="mb-3">
        <CFormInput
          type="number"
          id="port"
          value={createServerInput.port}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setCreateServerInput({ ...createServerInput, port: parseInt(event.target.value) })
          }
        />
        <CFormLabel>{t('servers.columns.port')}</CFormLabel>
      </CFormFloating>
      <CFormFloating className="mb-3">
        <CFormInput
          type="number"
          id="websocket_port"
          value={createServerInput.websocket_port}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setCreateServerInput({
              ...createServerInput,
              websocket_port: parseInt(event.target.value),
            })
          }
        />
        <CFormLabel>{t('servers.columns.websocket_port')}</CFormLabel>
      </CFormFloating>
      <CFormSwitch
        label={t('servers.columns.production')}
        id="production"
        checked={createServerInput?.production}
        onChange={() =>
          setCreateServerInput({
            ...createServerInput,
            production: !createServerInput?.production,
          })
        }
      />
      <CFormSwitch
        label={t('servers.columns.enabled')}
        id="enabled"
        checked={createServerInput?.enabled}
        onChange={() =>
          setCreateServerInput({
            ...createServerInput,
            enabled: !createServerInput?.enabled,
          })
        }
      />

      <div className="text-right">
        <ButtonSave />
      </div>
    </CForm>
  )
}

export default CreateServerForm
