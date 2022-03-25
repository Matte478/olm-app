import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { UserExperimentSchemaFragment } from '__generated__/graphql'
import { ModalPreview } from 'components'
import { CButton } from '@coreui/react'
import { toast } from 'react-toast'
import CIcon from '@coreui/icons-react'
import { cilImage } from '@coreui/icons'

type Props = {
  schema: UserExperimentSchemaFragment
  className: string
}

const ShowUserExperimentSchema: React.FC<Props> = ({ schema, className = '' }: Props) => {
  const { t } = useTranslation()
  const [visiblePreview, setVisiblePreview] = useState(false)

  return (
    <div className={className}>
      <ModalPreview
        active={visiblePreview}
        src={schema?.preview ?? null}
        handleDismiss={() => {
          setVisiblePreview(false)
        }}
      />
      <strong>{t('user_experiments.columns.schema')}:</strong>
      <CButton
        color="warning"
        className="ms-2 d-inline-flex justify-content-center align-items-center"
        onClick={() => {
          schema?.preview
            ? setVisiblePreview(true)
            : toast.error(t('user_experiments.preview.error'))
        }}
      >
        <CIcon content={cilImage} className="me-1" />
        {schema.name}
      </CButton>
    </div>
  )
}

export default ShowUserExperimentSchema
