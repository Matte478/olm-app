import React from 'react'
import { Can } from 'components'
import { TableAction } from 'types'
import { CButton } from '@coreui/react'

interface Props {
  action: TableAction
  id: string
  deletedAt?: string
}

const TableRowAction: React.FC<Props> = ({ action, id, deletedAt }: Props) => {
  if (typeof action.onDeleted !== 'undefined' && !action.onDeleted && deletedAt) return <></>
  if (typeof action.onNonDeleted !== 'undefined' && !action.onNonDeleted && !deletedAt) return <></>
  
  return (
    <Can permission={action.permission}>
      <CButton
        color={action.color}
        className={`ms-1 d-inline-flex justify-content-center align-items-center ${
          action.textColor && 'text-' + action.textColor
        }`}
        onClick={() => action.handleClick(id)}
      >
        {action.icon && action.icon}
        {action.text && <span className={action.icon && 'ms-1'}>{action.text}</span>}
      </CButton>
    </Can>
  )
}

export default TableRowAction
