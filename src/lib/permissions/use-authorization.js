import { useMemo } from 'react'

import { useAuth } from '@/features/auth/context/auth-provider'
import {
  canAccessRoute,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '@/lib/permissions/helpers'

export function useAuthorization() {
  const { role } = useAuth()

  return useMemo(
    () => ({
      role,
      hasPermission: (permission) => hasPermission(role, permission),
      hasAnyPermission: (permissions) => hasAnyPermission(role, permissions),
      hasAllPermissions: (permissions) => hasAllPermissions(role, permissions),
      canAccessRoute: (permissions) => canAccessRoute(role, permissions),
    }),
    [role],
  )
}
