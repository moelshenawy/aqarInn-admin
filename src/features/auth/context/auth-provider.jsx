import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { registerUnauthorizedHandler } from '@/lib/api/http-client'
import { APP_ROLES } from '@/lib/permissions/constants'

const AuthContext = createContext(null)

const PREVIEW_USER = {
  id: 'preview-user',
  email: 'preview@aqarinn.sa',
  name: 'UI Preview',
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState(APP_ROLES.operationsAdmin)

  const setPreviewRole = useCallback((nextRole) => {
    setRole(nextRole)
  }, [])

  const resetPreviewRole = useCallback(() => {
    setRole(APP_ROLES.operationsAdmin)
  }, [])

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      resetPreviewRole()
    })
  }, [resetPreviewRole])

  const value = useMemo(
    () => ({
      session: null,
      user: PREVIEW_USER,
      role,
      isAuthenticated: true,
      setPreviewRole,
      resetPreviewRole,
    }),
    [resetPreviewRole, role, setPreviewRole],
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
