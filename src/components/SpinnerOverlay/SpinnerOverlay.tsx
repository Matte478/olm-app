import React from 'react'
import { CSpinner } from '@coreui/react'

import './SpinnerOverlay.scss'

interface Props {
  transparent?: boolean
  className?: string
  style?: {}
}

const SpinnerOverlay: React.FC<Props> = ({ transparent = false, className = '', style = {} }: Props) => {
  return (
    <div
      className={`spinner-overlay ${transparent ? 'spinner-overlay--transparent' : 'bg-light'
        } ${className}`}
      style={style}
    >
      <CSpinner color="info" style={{ width: '4rem', height: '4rem' }} />
    </div>
  )
}

export default SpinnerOverlay
