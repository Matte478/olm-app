import React from 'react'
import { cilPlus } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { ButtonIcon } from 'components'

interface Props {
  to: string
  className?: string
}

const ButtonAdd: React.FC<Props> = ({ to, className = '' }: Props) => {
  const { t } = useTranslation()

  return <ButtonIcon to={to} icon={cilPlus} text={t('actions.create')} className={className} />
}

export default ButtonAdd
