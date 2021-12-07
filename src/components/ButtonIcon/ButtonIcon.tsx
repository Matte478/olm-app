import React from 'react'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'

interface Props {
  to: string
  icon: any
  text?: string
  className?: string
}

const ButtonIcon: React.FC<Props> = ({ to, icon, text, className = '' }: Props) => {
  return (
    <Link to={to}>
      <CButton className={`d-inline-flex justify-content-center align-items-center ${className}`}>
        <CIcon className="me-1" content={icon} />
        {text && text}
      </CButton>
    </Link>
  )
}

export default ButtonIcon
