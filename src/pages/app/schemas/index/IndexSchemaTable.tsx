import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { ErrorNotifier, Table } from 'components'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toast'
import { TableAction, TableColumn } from 'types'
import { useDeleteSchemaMutation } from '__generated__/graphql'

interface Props {
  schemas: any
  refetch: () => void
}

const IndexSchemaTable: React.FC<Props> = ({ schemas, refetch }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [deleteSchemaMutation, { error }] = useDeleteSchemaMutation()

  const handleDeleteSchema = async (id: string) => {
    let response = window.confirm(t('schemas.delete.confirm'))
    if (response) {
      await deleteSchemaMutation({
        variables: { id },
      })
        .then(() => {
          refetch()
          toast.success(t('schemas.delete.success'))
        })
        .catch(() => {})
    }
  }

  const columns: TableColumn[] = [
    {
      column: 'id',
      name: t('schemas.columns.id'),
      style: { width: '80px' },
    },
    {
      column: 'name',
      name: t('schemas.columns.name'),
    },
    {
      column: 'deviceType.name',
      name: t('schemas.columns.device_type'),
    },
    {
      column: 'software.name',
      name: t('schemas.columns.software'),
    },
  ]

  const actions: TableAction[] = [
    {
      color: 'primary',
      icon: <CIcon content={cilPencil} />,
      permission: 'schema.update',
      handleClick: (id: string) => {
        navigate(`/app/schemas/${id}/edit`)
      },
    },
    {
      color: 'danger',
      textColor: 'light',
      permission: 'schema.delete',
      icon: <CIcon content={cilTrash} />,
      handleClick: handleDeleteSchema,
    },
  ]

  if (error) return <ErrorNotifier error={error} />

  return <Table columns={columns} data={schemas} actions={actions} />
}

export default IndexSchemaTable
