import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'

import { PermissionBasicFragment, usePermissionsQuery } from '__generated__/graphql'
import { ErrorNotifier, SpinnerOverlay } from 'components'

interface Props {
  preselected?: string[]
  handleChange: (ids: string[]) => void
}

type format = { [U: string]: { value: string; label: string }[] }

const formattedPermissions = (permissions: PermissionBasicFragment[], preselected: string[]) => {
  let preselectedFormatted: format = {}
  let formatted: format = {}
  permissions.forEach((permission) => {
    const [model, action]: string[] = permission.name.split('.')
    const tmp = { value: permission.id, label: action }
    formatted[model] = [...(formatted[model] ?? []), tmp]

    if (preselected.includes(permission.id)) {
      preselectedFormatted[model] = [...(preselectedFormatted[model] ?? []), tmp]
    }
  })

  return [formatted, preselectedFormatted]
}

const RoleFormPermissions: React.FC<Props> = ({ preselected = [], handleChange }: Props) => {
  const { t } = useTranslation()
  const { data, error, loading } = usePermissionsQuery()
  const [selected, setSelected] = useState<format>({})
  const [allFormatted, setAllFormatted] = useState<format>({})

  const handleSelectChange = (key: string, input: { value: string; label: string }[]) => {
    const actualSelected = { ...selected, [key]: [...input] }
    setSelected(actualSelected)

    let ids: string[] = []
    for (const key in actualSelected) {
      const tmp = actualSelected[key].map((t) => t.value)
      ids = [...ids, ...tmp]
    }

    handleChange(ids)
  }

  // useEffect(() => {
  //   let ids: string[] = []
  //   for (const key in selected) {
  //     const tmp = selected[key].map((t) => t.value)
  //     ids = [...ids, ...tmp]
  //   }
  //     handleChange(ids)
  // }, [selected])

  useEffect(() => {
    if (data?.permissions) {
      const [allFormatted, preselectedFormatted] = formattedPermissions(
        data.permissions,
        preselected,
      )
      setSelected(preselectedFormatted)
      setAllFormatted(allFormatted)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (loading) return <SpinnerOverlay transparent={true} />
  if (error) return <ErrorNotifier error={error} />

  const formSelect = () => {
    let selects: JSX.Element[] = []

    for (const key in allFormatted) {
      selects = [
        ...selects,
        <div key={key}>
          <label>{t(`permissions.${key}`)}</label>
          <Select
            className="mb-3"
            options={allFormatted[key]}
            value={selected[key]}
            isMulti
            onChange={(input) => {
              // setSelected({ ...selected, [key]: [...input] })
              handleSelectChange(key, [...input])
            }}
          />
        </div>,
      ]
    }

    return selects
  }

  return <React.Fragment>{formSelect()}</React.Fragment>
}

export default RoleFormPermissions
