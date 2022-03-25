import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { AuthenticatedUserFragment } from '__generated__/graphql'
import { AppStateContext } from 'provider'
import { ErrorNotifier } from '..'
import { can } from 'utils/permissions'

interface Props {
  children: JSX.Element
  permission?: string | string[]
  additional?: (user: AuthenticatedUserFragment) => boolean
  notify?: boolean
}

const Can: React.FC<Props> = ({ children, permission, additional, notify = false }: Props) => {
  const { appState } = useContext(AppStateContext)
  const { t } = useTranslation()

  if (!permission || can(permission, appState.authUser, additional)) return children

  return notify ? <ErrorNotifier error={t('actions.error.not-authorized')} /> : <></>
}

export default Can
