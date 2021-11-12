import React, { useContext } from 'react'

import { AppStateContext } from 'provider'
import { ErrorNotifier } from '..'
import { useTranslation } from 'react-i18next'

interface Props {
  children: JSX.Element
  permission?: string
  notify?: boolean
}

const check = (permissions: string[], permission: string) => permissions.includes(permission)

const Can: React.FC<Props> = ({ children, permission, notify = false }: Props) => {
  const { appState } = useContext(AppStateContext)
  const { t } = useTranslation()

  if (!permission || check(appState.authUser?.permissionsList || [], permission)) return children

  return notify ? <ErrorNotifier error={t('actions.error.not-authorized')} /> : <></>
}

export default Can
