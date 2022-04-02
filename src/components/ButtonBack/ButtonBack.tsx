import React from 'react'
import { cilArrowLeft } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { ButtonIcon } from 'components'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  className?: string
}

const ButtonBack: React.FC<Props> = ({ className = '' }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <CButton color="warning" className={`d-inline-flex justify-content-center align-items-center ${className}`} onClick={() => {
      navigate(-1)
    }}>
      <CIcon className="me-1" content={cilArrowLeft} />
      {t('actions.back')}
    </CButton>
  )
  // <ButtonIcon to={to} icon={cilArrowLeft} text={t('actions.back')} className={className} color="warning" />
}

export default ButtonBack
