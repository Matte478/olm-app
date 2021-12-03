import React, { useState } from 'react'
import { CButton, CTableDataCell, CTableRow } from '@coreui/react'
import { cilArrowBottom, cilArrowTop } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Presets } from 'react-component-transition'

import { TableColumnsNested, TableAction, TableColumn } from 'types'
import { Can, Table } from 'components'
import TableRowItem from './TableRowItem'

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
      <CTableRow>
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
                  {open && <CIcon content={cilArrowTop} />}
                  {!open && <CIcon content={cilArrowBottom} />}
                  {/* <CIcon content={open ? cilArrowTop : cilArrowBottom} /> */}
                  {columnsNested.name}
                </CButton>
              )}
              {actions?.map(
                (
                  { color, icon, permission, text, textColor, handleClick }: TableAction,
                  index: number,
                ) => (
                  <Can permission={permission} key={index}>
                    <CButton
                      color={color}
                      className={`ms-1 d-inline-flex justify-content-center align-items-center ${
                        textColor && 'text-' + textColor
                      }`}
                      onClick={() => handleClick(data.id)}
                    >
                      {icon && icon}
                      {text && <span className={icon && 'ms-1'}>{text}</span>}
                    </CButton>
                  </Can>
                ),
              )}
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
                <div style={{ margin: '1rem 3rem' }}>
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
