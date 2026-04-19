import { rolePermissions } from '@/lib/permissions/role-permissions'
import { normalizePermissionRoles } from '@/lib/permissions/role-utils'

export function hasPermission(roleOrRoles, permission) {
  if (!roleOrRoles || !permission) {
    return false
  }

  const normalizedRoles = normalizePermissionRoles(roleOrRoles)
  if (!normalizedRoles.length) {
    return false
  }

  return normalizedRoles.some((role) =>
    (rolePermissions[role] ?? []).some(
      (entry) =>
        entry.resource === permission.resource &&
        entry.action === permission.action,
    ),
  )
}

export function hasAnyPermission(roleOrRoles, permissions = []) {
  if (!permissions.length) {
    return true
  }
  return permissions.some((permission) => hasPermission(roleOrRoles, permission))
}

export function hasAllPermissions(roleOrRoles, permissions = []) {
  if (!permissions.length) {
    return true
  }
  return permissions.every((permission) => hasPermission(roleOrRoles, permission))
}

export function canAccessRoute(roleOrRoles, requiredPermissions = []) {
  return hasAllPermissions(roleOrRoles, requiredPermissions)
}
