import { APP_ROLES } from '@/lib/permissions/constants'

const ROLE_ALIASES = Object.freeze({
  [APP_ROLES.superAdmin]: APP_ROLES.superAdmin,
  superadmin: APP_ROLES.superAdmin,
  admin: APP_ROLES.superAdmin,

  [APP_ROLES.operationsAdmin]: APP_ROLES.operationsAdmin,
  operationsadmin: APP_ROLES.operationsAdmin,
  operationadmin: APP_ROLES.operationsAdmin,
  operation_admin: APP_ROLES.operationsAdmin,
  operations: APP_ROLES.operationsAdmin,

  [APP_ROLES.investmentManager]: APP_ROLES.investmentManager,
  investmentmanager: APP_ROLES.investmentManager,
  investment_manager: APP_ROLES.investmentManager,

  [APP_ROLES.readOnlyViewer]: APP_ROLES.readOnlyViewer,
  readonlyviewer: APP_ROLES.readOnlyViewer,
  read_only_viewer: APP_ROLES.readOnlyViewer,
  readonly: APP_ROLES.readOnlyViewer,
  read_only: APP_ROLES.readOnlyViewer,
  viewer: APP_ROLES.readOnlyViewer,
})

const ROLE_PRIORITY = Object.freeze([
  APP_ROLES.superAdmin,
  APP_ROLES.operationsAdmin,
  APP_ROLES.investmentManager,
  APP_ROLES.readOnlyViewer,
])

function toRoleToken(value) {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[-\s]/g, '_')

  if (!normalized) {
    return null
  }

  return normalized.replace(/_/g, '')
}

export function normalizePermissionRole(role) {
  const token = toRoleToken(role)
  if (!token) {
    return null
  }

  return ROLE_ALIASES[token] ?? null
}

export function normalizePermissionRoles(roles, fallbackRole = null) {
  const values = Array.isArray(roles) ? roles : [roles]
  const normalized = [
    ...new Set(values.map(normalizePermissionRole).filter(Boolean)),
  ]

  if (normalized.length > 0) {
    return normalized
  }

  const fallback = normalizePermissionRole(fallbackRole)
  return fallback ? [fallback] : []
}

export function getPrimaryPermissionRole(
  roles,
  fallbackRole = APP_ROLES.operationsAdmin,
) {
  const normalizedRoles = normalizePermissionRoles(roles, fallbackRole)

  const prioritized = ROLE_PRIORITY.find((role) =>
    normalizedRoles.includes(role),
  )

  return prioritized ?? normalizedRoles[0] ?? APP_ROLES.operationsAdmin
}
