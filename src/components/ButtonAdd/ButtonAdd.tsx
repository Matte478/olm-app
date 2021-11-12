import React from 'react'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { CButton } from '@coreui/react'

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
