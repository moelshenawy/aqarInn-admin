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

function getRoleFromAuthUser(user) {
  if (!user) {
    return APP_ROLES.operationsAdmin
  }

  if (
    user.is_super_admin ||
    user.isSuperAdmin ||
    user.is_admin ||
    user.isAdmin
  ) {
    return APP_ROLES.superAdmin
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

  const normalizedRoles = new Set(
    possibleRoles
      .filter(Boolean)
      .map((value) =>
        value.toString().trim().toLowerCase().replace(/[-\s]/g, '_'),
      ),
  )

  if (
    normalizedRoles.has(APP_ROLES.superAdmin) ||
    normalizedRoles.has('superadmin') ||
    normalizedRoles.has('admin')
  ) {
    return APP_ROLES.superAdmin
  }

  if (
    normalizedRoles.has(APP_ROLES.operationsAdmin) ||
    normalizedRoles.has('operationsadmin') ||
    normalizedRoles.has('operations') ||
    normalizedRoles.has('operationadmin')
  ) {
    return APP_ROLES.operationsAdmin
  }

  if (
    normalizedRoles.has(APP_ROLES.investmentManager) ||
    normalizedRoles.has('investmentmanager')
  ) {
    return APP_ROLES.investmentManager
  }

  if (
    normalizedRoles.has(APP_ROLES.readOnlyViewer) ||
    normalizedRoles.has('readonlyviewer')
  ) {
    return APP_ROLES.readOnlyViewer
  }

  return APP_ROLES.operationsAdmin
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => {
    try {
      const raw = localStorage.getItem('authUser')
      const storedUser = raw ? normalizeAuthUser(JSON.parse(raw)) : null
      return getRoleFromAuthUser(storedUser)
    } catch (e) {
      return APP_ROLES.operationsAdmin
    }
  })

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
    setRole(nextRole)
  }, [])

  const resetPreviewRole = useCallback(() => {
    setRole(APP_ROLES.operationsAdmin)
  }, [])

  const login = useCallback(({ token, admin, user }) => {
    const authUser = admin ?? user
    const nextUser = normalizeAuthUser(authUser)
    const nextRole = getRoleFromAuthUser(authUser)

    try {
      localStorage.setItem('authToken', token)
      localStorage.setItem('authUser', JSON.stringify(nextUser))
    } catch (e) {
      // ignore storage errors
    }

    setUser(nextUser)
    setRole(nextRole)
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
