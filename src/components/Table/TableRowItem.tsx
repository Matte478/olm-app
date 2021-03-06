import React from 'react'
import { cilCheckAlt, cilMinus, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CBadge } from '@coreui/react'

interface Props {
  item: any
  keys: string
}

const TableRowItem: React.FC<Props> = ({ item, keys }: Props) => {
  const keysArr = keys.split('.')
  let data = item

  keysArr.forEach((key) => {
    if (Array.isArray(data)) {
      data = data.map((arrayItem: any) => arrayItem[key])
    } else {
      data = data ? data[key] : null
    }
  })

  return Array.isArray(data) ? (
    <>
      {data.map((badge: string, index: number) => (
        <CBadge className="mx-1" color="dark" key={index}>
          {badge}
        </CBadge>
      ))}
    </>
  ) : data === null ? (
    <CIcon content={cilMinus} size="xl" className="text-secondary" key={data} />
  ): data === true ? (
    <CIcon content={cilCheckAlt} size="xl" className="text-success" key={data} />
  ) : data === false ? (
    <CIcon content={cilX} size="xl" className="text-danger" key={data} />
  ) : (
    <span>{data}</span>
  )
}

export default TableRowItem
