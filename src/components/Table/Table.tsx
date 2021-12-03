import React from 'react'
import { CTable, CTableBody } from '@coreui/react'

import { TableAction, TableColumn, TableColumnsNested } from 'types'
import TableRow from './TableRow'
import TableHead from './TableHead'

interface Props {
  data: object[]
  columns: TableColumn[]
  columnsNested?: TableColumnsNested
  actions?: TableAction[]
  layout?: 'auto' | 'fixed' | 'inherit' | 'initial' | 'revert' | 'unset'
  hover?: boolean
}

const Table: React.FC<Props> = ({
  data,
  columns,
  actions,
  columnsNested,
  layout = 'fixed',
  hover = true,
}: Props) => {
  return (
    <CTable hover={hover} align="middle" style={{ tableLayout: layout }}>
      <TableHead columns={columns} hasActions={!!(actions || columnsNested)} />

      <CTableBody>
        {data.map((item: any, rowIndex: number) => (
          <TableRow
            columns={columns}
            data={item}
            actions={actions}
            columnsNested={columnsNested}
            key={rowIndex}
          />
        ))}
      </CTableBody>
    </CTable>
  )
}

export default Table
