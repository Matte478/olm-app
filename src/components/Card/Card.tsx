import React from 'react'
import CIcon from '@coreui/icons-react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

interface Props {
  children?: JSX.Element | string | (JSX.Element | string)[]
  icon?: any
  title: string
  actions?: JSX.Element | JSX.Element[]
  className?: string
}

const Card: React.FC<Props> = ({ children, icon, title, actions, className = '' }: Props) => {
  return (
    <CCard className={className}>
      <CCardHeader className="d-flex flex-column flex-md-row align-items-center justify-content-between">
        <strong className="d-flex mb-1 mb-md-0 align-items-center justify-content-center">
          {icon && <CIcon content={icon} className="me-1" />}
          {title}
        </strong>
        {actions && <div>{actions}</div>}
      </CCardHeader>
      <CCardBody>{children}</CCardBody>
    </CCard>
  )
}

export default Card
