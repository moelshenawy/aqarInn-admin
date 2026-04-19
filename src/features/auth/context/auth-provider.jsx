import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  registerUnauthorizedHandler,
  registerAccessTokenResolver,
} from '@/lib/api/http-client'
import { APP_ROLES } from '@/lib/permissions/constants'
import {
  getPrimaryPermissionRole,
  normalizePermissionRoles,
} from '@/lib/permissions/role-utils'

const AuthContext = createContext(null)

const PREVIEW_USER = {
  id: 'preview-user',
  email: 'preview@aqarinn.sa',
  name: 'UI Preview',
}

function normalizeAuthUser(user) {
  if (!user) {
    return PREVIEW_USER
  }

  return {
    ...user,
    name:
      user.name ??
      user.full_name_ar ??
      user.full_name_en ??
      user.email ??
      PREVIEW_USER.name,
  }
}

function getRolesFromAuthUser(user) {
  if (!user) {
    return [APP_ROLES.operationsAdmin]
  }

  const possibleRoles = []

  if (typeof user.role === 'string') possibleRoles.push(user.role)
  if (typeof user.roleName === 'string') possibleRoles.push(user.roleName)
  if (typeof user.role_name === 'string') possibleRoles.push(user.role_name)
  if (typeof user.type === 'string') possibleRoles.push(user.type)

  if (Array.isArray(user.roles)) {
    user.roles.forEach((role) => {
      if (typeof role === 'string') {
        possibleRoles.push(role)
      } else if (role && typeof role.name === 'string') {
        possibleRoles.push(role.name)
      }
    })
  }

  const normalizedRoles = normalizePermissionRoles(possibleRoles)

  if (
    user.is_super_admin ||
    user.isSuperAdmin ||
    user.is_admin ||
    user.isAdmin
  ) {
    if (!normalizedRoles.includes(APP_ROLES.superAdmin)) {
      normalizedRoles.unshift(APP_ROLES.superAdmin)
    }
  }

  return normalizedRoles.length > 0 ? normalizedRoles : [APP_ROLES.operationsAdmin]
}

function getInitialRolesFromStorage() {
  try {
    const raw = localStorage.getItem('authUser')
    const storedUser = raw ? normalizeAuthUser(JSON.parse(raw)) : null
    return getRolesFromAuthUser(storedUser)
  } catch (e) {
    return [APP_ROLES.operationsAdmin]
  }
}

export function AuthProvider({ children }) {
  const [roles, setRoles] = useState(() => getInitialRolesFromStorage())
  const [role, setRole] = useState(() =>
    getPrimaryPermissionRole(getInitialRolesFromStorage(), APP_ROLES.operationsAdmin),
  )

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('authUser')
      return raw ? normalizeAuthUser(JSON.parse(raw)) : PREVIEW_USER
    } catch (e) {
      return PREVIEW_USER
    }
  })

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem('authToken')),
  )

  const setPreviewRole = useCallback((nextRole) => {
    const nextRoles = normalizePermissionRoles(nextRole, APP_ROLES.operationsAdmin)
    setRoles(nextRoles)
    setRole(getPrimaryPermissionRole(nextRoles, APP_ROLES.operationsAdmin))
  }, [])

  const resetPreviewRole = useCallback(() => {
    setRoles([APP_ROLES.operationsAdmin])
    setRole(APP_ROLES.operationsAdmin)
  }, [])

  const login = useCallback(({ token, admin, user }) => {
    const authUser = admin ?? user
    const nextUser = normalizeAuthUser(authUser)
    const nextRoles = getRolesFromAuthUser(authUser)
    const nextRole = getPrimaryPermissionRole(
      nextRoles,
      APP_ROLES.operationsAdmin,
    )

    try {
      localStorage.setItem('authToken', token)
      localStorage.setItem('authUser', JSON.stringify(nextUser))
    } catch (e) {
      // ignore storage errors
    }

    setUser(nextUser)
    setRole(nextRole)
    setRoles(nextRoles)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
    } catch (e) {
      // ignore
    }

    setUser(PREVIEW_USER)
    setIsAuthenticated(false)
    resetPreviewRole()
  }, [resetPreviewRole])

  useEffect(() => {
    registerAccessTokenResolver(() => localStorage.getItem('authToken'))
    registerUnauthorizedHandler(() => {
      logout()
    })
  }, [logout])

  const value = useMemo(
    () => ({
      session: null,
      user,
      role,
      roles,
      isAuthenticated,
      setPreviewRole,
      resetPreviewRole,
      login,
      logout,
    }),
    [
      user,
      resetPreviewRole,
      role,
      roles,
      setPreviewRole,
      isAuthenticated,
      login,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
