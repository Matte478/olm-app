import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'
import { CForm, CFormFloating, CFormInput, CFormLabel, CFormSwitch } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

import { ButtonBack, ButtonSave, ErrorNotifier, SpinnerOverlay } from 'components'
import {
  ServerExtendedFragment,
  UpdateServerInput,
  useUpdateServerMutation,
} from '__generated__/graphql'

interface Props {
  server: ServerExtendedFragment
}

const EditServerForm: React.FC<Props> = ({ server }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const [updateServerInput, setUpdateServerInput] = useState<UpdateServerInput>({
    id: server.id,
    name: server.name,
    ip_address: server.ip_address,
    api_domain: server.api_domain,
    websocket_port: server.websocket_port,
    production: server.production,
    enabled: server.enabled,
  })

  const [editServerMutation, { loading, error }] = useUpdateServerMutation()

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault()

    await editServerMutation({
      variables: {
        updateServerInput,
      },
    })
      .then((data) => {
        if (data.data?.updateServer) {
          toast.success(t('servers.update.success'))
          navigate('/app/servers/')
        }
      })
      .catch(() => { })
  }
  return (
    <CForm onSubmit={handleEdit}>
      {loading && <SpinnerOverlay transparent={true} />}
      <ErrorNotifier error={error} />
      <CFormFloating className="mb-3">
        <CFormInput
          type="text"
          id="name"
          value={updateServerInput.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUpdateServerInput({ ...updateServerInput, name: event.target.value })
          }
        />
        <CFormLabel>{t('servers.columns.name')}</CFormLabel>
      </CFormFloating>
      <CFormFloating className="mb-3">
        <CFormInput
          type="text"
          id="ip_address"
          value={updateServerInput.ip_address}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUpdateServerInput({ ...updateServerInput, ip_address: event.target.value })
          }
        />
        <CFormLabel>{t('servers.columns.ip_address')}</CFormLabel>
      </CFormFloating>
      <CFormFloating className="mb-3">
        <CFormInput
          type="text"
          id="api_domain"
          value={updateServerInput.api_domain}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUpdateServerInput({ ...updateServerInput, api_domain: event.target.value })
          }
        />
        <CFormLabel>{t('servers.columns.api_domain')}</CFormLabel>
      </CFormFloating>
      <CFormFloating className="mb-3">
        <CFormInput
          type="number"
          id="websocket_port"
          value={updateServerInput.websocket_port}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUpdateServerInput({
              ...updateServerInput,
              websocket_port: parseInt(event.target.value),
            })
          }
        />
        <CFormLabel>{t('servers.columns.websocket_port')}</CFormLabel>
      </CFormFloating>
      <CFormSwitch
        label={t('servers.columns.production')}
        id="production"
        checked={updateServerInput.production}
        onChange={() =>
          setUpdateServerInput({
            ...updateServerInput,
            production: !updateServerInput.production,
          })
        }
      />
      <CFormSwitch
        label={t('servers.columns.enabled')}
        id="enabled"
        checked={updateServerInput.enabled}
        onChange={() =>
          setUpdateServerInput({
            ...updateServerInput,
            enabled: !updateServerInput.enabled,
          })
        }
      />

      <div className="text-right">
        <ButtonBack className="me-2" />
        <ButtonSave />
      </div>
    </CForm>
  )
}

export default EditServerForm
