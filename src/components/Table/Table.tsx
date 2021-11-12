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

import { TableAction, TableColumn } from 'types'
import { Can } from '..'

interface Props {
  data: object[]
  columns: TableColumn[]
  actions?: TableAction[]
  layout?: 'auto' | 'fixed' | 'inherit' | 'initial' | 'revert' | 'unset'
  hover?: boolean
}

const Table: React.FC<Props> = ({
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
                    {actions.map(
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
                            onClick={() => handleClick(item.id)}
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
          )
        })}
      </CTableBody>
    </CTable>
  )
}

export default Table
