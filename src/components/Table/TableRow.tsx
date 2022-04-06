import React, { useState } from 'react'
import { CButton, CTableDataCell, CTableRow } from '@coreui/react'
import { cilArrowBottom, cilArrowTop } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Presets } from 'react-component-transition'

import { TableColumnsNested, TableAction, TableColumn } from 'types'
import { Table } from 'components'
import TableRowItem from './TableRowItem'
import TableRowAction from './TableRowAction'

interface Props {
  columns: TableColumn[]
  data: any
  columnsNested?: TableColumnsNested
  actions?: TableAction[]
  isOpen?: boolean
}

const TableRow: React.FC<Props> = ({
  columns,
  data,
  actions,
  columnsNested,
  isOpen = false,
}: Props) => {
  const [open, setOpen] = useState(isOpen)

  return (
    <>
      <CTableRow style={{ backgroundColor: data.deleted_at ? 'rgba(255,0,0,0.2)' : '' }}>
        {columns.map(({ column }: TableColumn, columnIndex: number) => (
          <CTableDataCell scope="row" key={columnIndex}>
            <TableRowItem item={data} keys={column} />
          </CTableDataCell>
        ))}
        {(actions || columnsNested) && (
          <CTableDataCell scope="row" className="text-right" style={{ width: '100px' }}>
            <div className="d-flex justify-content-end align-items-stretch">
              {columnsNested && (
                <CButton
                  className={'ms-1 d-inline-flex justify-content-center align-items-center'}
                  onClick={() => setOpen(!open)}
                >
                  <CIcon content={open ? cilArrowTop : cilArrowBottom} key={open.toString()} />
                  {columnsNested.name}
                </CButton>
              )}
              {actions?.map((action: TableAction, index: number) => (
                <TableRowAction action={action} id={data.id} deletedAt={data.deleted_at} key={index} />
              ))}
            </div>
          </CTableDataCell>
        )}
      </CTableRow>
      {columnsNested && data[columnsNested.key] && (
        <CTableRow>
          <CTableDataCell
            scope="row"
            colSpan={columns.length + (actions ? 1 : 0)}
            style={{ padding: 0, border: 'none' }}
          >
            <Presets.TransitionFade>
              {open && (
                <div style={{ margin: '0 3rem', padding: '1rem 0' }}>
                  <h5>{columnsNested.name}</h5>
                  <Table data={data.devices} columns={columnsNested.columns}></Table>
                </div>
              )}
            </Presets.TransitionFade>
          </CTableDataCell>
        </CTableRow>
      )}
    </>
  )
}

export default TableRow
