import { rolePermissions } from '@/lib/permissions/role-permissions'

export function hasPermission(role, permission) {
  if (!role || !permission) {
    return false
  }

  return (rolePermissions[role] ?? []).some(
    (entry) =>
      entry.resource === permission.resource &&
      entry.action === permission.action,
  )
}

export function hasAnyPermission(role, permissions = []) {
  if (!permissions.length) {
    return true
  }
  return permissions.some((permission) => hasPermission(role, permission))
}

export function hasAllPermissions(role, permissions = []) {
  if (!permissions.length) {
    return true
  }
  return permissions.every((permission) => hasPermission(role, permission))
}

export function canAccessRoute(role, requiredPermissions = []) {
  return hasAllPermissions(role, requiredPermissions)
}
