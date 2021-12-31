import { AuthenticatedUserFragment } from '__generated__/graphql'

const check = (permissions: string[] = [], permission: string) => permissions.includes(permission)

const can = (
  permissions: string | string[],
  user?: AuthenticatedUserFragment,
  additional?: (user: AuthenticatedUserFragment) => boolean,
) => {
  let allowed = false

  if (Array.isArray(permissions)) {
    allowed = permissions.some((p) => check(user?.permissionsList, p))
  } else {
    allowed = check(user?.permissionsList, permissions)
  }

  return allowed && (!user ? false : additional?.(user) ?? true)
}

export { can }
