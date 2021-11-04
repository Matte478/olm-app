import CIcon from '@coreui/icons-react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import React from 'react'

interface Props {
  children?: JSX.Element | JSX.Element[] | string
  icon?: any
  title: string
  aditional?: JSX.Element
}

const AppCard: React.FC<Props> = ({ children, icon, title, aditional }: Props) => {
  return (
    <CCard>
      <CCardHeader className="d-flex align-items-center justify-content-between">
        <strong className="d-flex align-items-center justify-content-center">
          {icon && <CIcon content={icon} className="me-1" />}
          {title}
        </strong>
        {aditional && aditional}
      </CCardHeader>
      <CCardBody>{children}</CCardBody>
    </CCard>
  )
}

export default AppCard
