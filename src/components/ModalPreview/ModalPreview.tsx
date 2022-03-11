import React from 'react'
import { useTranslation } from 'react-i18next'
import { CImage, CModal, CModalHeader, CModalTitle } from '@coreui/react'

type Props = {
  active: boolean
  src: string | null
  handleDismiss: () => void
  title?: string
}

const ModalPreview: React.FC<Props> = ({ active = false, src, handleDismiss, title }: Props) => {
  const { t } = useTranslation()

  return (
    <CModal visible={active} alignment="center" size="xl" onDismiss={handleDismiss}>
      <CModalHeader>
        <CModalTitle>{title || t('schemas.preview.title')}</CModalTitle>
      </CModalHeader>
      {src && <CImage className="m-2" fluid src={src} />}
    </CModal>
  )
}

export default ModalPreview
