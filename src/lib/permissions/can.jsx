import { useAuthorization } from '@/lib/permissions/use-authorization'

export function Can({ allOf = [], anyOf = [], fallback = null, children }) {
  const { hasAllPermissions, hasAnyPermission } = useAuthorization()
  const allGranted = hasAllPermissions(allOf)
  const anyGranted = anyOf.length ? hasAnyPermission(anyOf) : true

  return allGranted && anyGranted ? children : fallback
}
