import { Navigate } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { useAuth } from '@/features/auth/context/auth-provider'

export function RootRedirectPage() {
  const { isAuthenticated } = useAuth()
  return (
    <Navigate
      to={isAuthenticated ? ROUTE_PATHS.dashboard : ROUTE_PATHS.login}
      replace
    />
  )
}
