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
import {
  clearSession,
  getSession,
  setSession,
} from '@/lib/storage/session-storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => getSession())

  const signInDemo = useCallback(
    ({ email, role = APP_ROLES.operationsAdmin }) => {
      const nextSession = {
        accessToken: 'demo-access-token',
        refreshToken: 'demo-refresh-token',
        user: {
          id: 'demo-user',
          email,
          name: email.split('@')[0],
          role,
        },
      }

      setSession(nextSession)
      setSessionState(nextSession)
      return nextSession
    },
    [],
  )

  const signOut = useCallback(() => {
    clearSession()
    setSessionState(null)
  }, [])

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      signOut()
    })
  }, [signOut])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      role: session?.user?.role ?? null,
      isAuthenticated: Boolean(session?.accessToken),
      signInDemo,
      signOut,
    }),
    [session, signInDemo, signOut],
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
