import React, { useContext } from 'react'

import { AppStateContext } from 'provider'
import { ErrorNotifier } from '..'
import { useTranslation } from 'react-i18next'
import { can } from 'utils/permissions'

interface Props {
  children: JSX.Element
  permission?: string | string[]
  notify?: boolean
}

const Can: React.FC<Props> = ({ children, permission, notify = false }: Props) => {
  const { appState } = useContext(AppStateContext)
  const { t } = useTranslation()

  if (!permission || can(permission, appState.authUser)) return children

  return notify ? <ErrorNotifier error={t('actions.error.not-authorized')} /> : <></>
}

export default Can
