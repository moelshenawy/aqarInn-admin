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

export function AuthProvider({ children }) {
  const [role, setRole] = useState(APP_ROLES.operationsAdmin)

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

  const login = useCallback(({ token, admin }) => {
    const nextUser = normalizeAuthUser(admin)

    try {
      localStorage.setItem('authToken', token)
      localStorage.setItem('authUser', JSON.stringify(nextUser))
    } catch (e) {
      // ignore storage errors
    }

    setUser(nextUser)
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
