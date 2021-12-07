import React from 'react'
import { CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { TableColumn } from 'types'

interface Props {
  columns: TableColumn[]
  hasActions?: boolean
}

const TableHead: React.FC<Props> = ({ columns, hasActions = false }: Props) => {
  return (
    <CTableHead>
      <CTableRow>
        {columns.map(({ column, name, style }: TableColumn) => (
          <CTableHeaderCell scope="col" key={column} style={style || {}}>
            {name}
          </CTableHeaderCell>
        ))}
        {hasActions && <CTableHeaderCell scope="col" />}
      </CTableRow>
    </CTableHead>
  )
}

export default TableHead
