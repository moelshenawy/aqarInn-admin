import { useMemo } from 'react'

import { useAuth } from '@/features/auth/context/auth-provider'
import {
  canAccessRoute,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '@/lib/permissions/helpers'

export function useAuthorization() {
  const { role, roles } = useAuth()
  const effectiveRoles = Array.isArray(roles) && roles.length ? roles : role

  return useMemo(
    () => ({
      role,
      roles: Array.isArray(roles) ? roles : [],
      hasPermission: (permission) => hasPermission(effectiveRoles, permission),
      hasAnyPermission: (permissions) =>
        hasAnyPermission(effectiveRoles, permissions),
      hasAllPermissions: (permissions) =>
        hasAllPermissions(effectiveRoles, permissions),
      canAccessRoute: (permissions) =>
        canAccessRoute(effectiveRoles, permissions),
    }),
    [effectiveRoles, role, roles],
  )
}
