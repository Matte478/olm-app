import React from 'react'
import { cilPen } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { ButtonIcon } from 'components'

interface Props {
  to: string
  className?: string
}

const ButtonEdit: React.FC<Props> = ({ to, className = '' }: Props) => {
  const { t } = useTranslation()

  return <ButtonIcon to={to} icon={cilPen} text={t('actions.edit')} className={className} />
}

export default ButtonEdit
