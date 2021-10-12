import React from 'react'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { TableAction, TableColumn } from '../../../types'

interface Props {
  data: object[]
  columns: TableColumn[]
  actions?: TableAction[]
  layout?: 'auto' | 'fixed' | 'inherit' | 'initial' | 'revert' | 'unset'
  hover?: boolean
}

const TableList: React.FC<Props> = ({
  data,
  columns,
  actions,
  layout = 'fixed',
  hover = true,
}: Props) => {
  return (
    <CTable hover={hover} align="middle" style={{ tableLayout: layout }}>
      <CTableHead>
        <CTableRow>
          {columns.map(({ column, name, style }: TableColumn) => (
            <CTableHeaderCell scope="col" key={column} style={style || {}}>
              {name}
            </CTableHeaderCell>
          ))}
          {actions && <CTableHeaderCell scope="col" />}
        </CTableRow>
      </CTableHead>

      <CTableBody>
        {data.map((item: any, rowIndex: number) => {
          return (
            <CTableRow key={rowIndex}>
              {columns.map(({ column }: TableColumn, columnIndex: number) => (
                <CTableDataCell scope="row" key={columnIndex}>
                  {item[column]}
                </CTableDataCell>
              ))}
              {actions && (
                <CTableDataCell scope="row" className="text-right" style={{ width: '100px' }}>
                  <div className="d-flex justify-content-end align-items-stretch">
                    {actions.map(({ color, icon, text, textColor }: TableAction, index: number) => (
                      <CButton
                        color={color}
                        className={`ms-1 d-inline-flex justify-content-center align-items-center ${
                          textColor && 'text-' + textColor
                        }`}
                        key={index}
                      >
                        {icon && icon}
                        {text && <span className={icon && 'ms-1'}>{text}</span>}
                      </CButton>
                    ))}
                  </div>
                </CTableDataCell>
              )}
            </CTableRow>
          )
        })}
      </CTableBody>
    </CTable>
  )
}

export default TableList
