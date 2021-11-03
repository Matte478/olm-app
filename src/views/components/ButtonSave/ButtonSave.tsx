import React from 'react'
import { useTranslation } from 'react-i18next'
import CIcon from '@coreui/icons-react'
import { cilSave } from '@coreui/icons'
import { CButton } from '@coreui/react'

const ButtonSave: React.FC = () => {
  const { t } = useTranslation()
  return (
    <CButton
      type="submit"
      className="d-inline-flex justify-content-center align-items-center"
      color="primary"
    >
      <CIcon content={cilSave} className="me-1" />
      {t('actions.save')}
    </CButton>
  )
}

export default ButtonSave
