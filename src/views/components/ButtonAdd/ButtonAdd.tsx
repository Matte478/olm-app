import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { CButton } from '@coreui/react'
import { Link } from 'react-router-dom'

interface Props {
  to: string
}

const ButtonAdd: React.FC<Props> = ({ to }: Props) => {
  return (
    <Link to={to}>
      <CButton className="text-center">
        <CIcon content={cilPlus} />
      </CButton>
    </Link>
  )
}

export default ButtonAdd
