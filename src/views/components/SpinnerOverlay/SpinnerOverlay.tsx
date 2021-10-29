import { CSpinner } from '@coreui/react'
import React from 'react'

import './SpinnerOverlay.scss'

interface Props {
  transparent?: boolean
  className?: string
}

const SpinnerOverlay: React.FC<Props> = ({ transparent = false, className = '' }: Props) => {
  return (
    <div
      className={`spinner-overlay ${
        transparent ? 'spinner-overlay--transparent' : 'bg-light'
      } ${className}`}
    >
      <CSpinner color="info" style={{ width: '4rem', height: '4rem' }} />
    </div>
  )
}

export default SpinnerOverlay
