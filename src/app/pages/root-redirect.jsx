import { Navigate } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'

export function RootRedirectPage() {
  return <Navigate to={ROUTE_PATHS.dashboard} replace />
}
