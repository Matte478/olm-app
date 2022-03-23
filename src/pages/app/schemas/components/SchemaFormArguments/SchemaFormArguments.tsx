import React, { useEffect, useState } from 'react'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { ArgumentInput } from '__generated__/graphql'
import SchemaFormArgumentsRow from './SchemaFormArgumentsRow'

interface Props {
  schemaArguments?: ArgumentInput[]
  handleChange?: (args: ArgumentInput[]) => void
}

const SchemaFormArguments: React.FC<Props> = ({
  schemaArguments: schemaArgumentsProp = [],
  handleChange,
}: Props) => {
  const { t } = useTranslation()

  const [schemaArguments, setSchemaArguments] = useState<ArgumentInput[]>(schemaArgumentsProp)

  useEffect(() => {
    if (handleChange) handleChange(schemaArguments)
  }, [schemaArguments])

  return (
    <>
      <h5 className="text-center mt-3">{t('schemas.arguments')}</h5>

      {schemaArguments.map((argument, index) => (
        <React.Fragment key={index}>
          <SchemaFormArgumentsRow
            argument={argument}
            handleDelete={() => {
              const reduced = [...schemaArguments]
              reduced.splice(index, 1)
              setSchemaArguments(reduced)
            }}
            handleChange={(arg) => {
              setSchemaArguments([
                ...schemaArguments.slice(0, index),
                arg,
                ...schemaArguments.slice(index + 1),
              ])
            }}
          />
          <hr />
        </React.Fragment>
      ))}

      <div className="text-center">
        <CButton
          className="d-inline-flex justify-content-center align-items-center text-light"
          onClick={() => {
            setSchemaArguments([
              ...schemaArguments,
              {
                name: '',
                label: '',
                default_value: '',
                row: 1,
                order: 1,
                options: [],
              },
            ])
          }}
        >
          <CIcon className="me-1" content={cilPlus} />
          {t('schemas.add_argument')}
        </CButton>
      </div>
    </>
  )
}

export default SchemaFormArguments
