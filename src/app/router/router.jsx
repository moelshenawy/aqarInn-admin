import { createBrowserRouter } from 'react-router-dom'

import { AuthLayout } from '@/app/layouts/auth-layout'
import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { NotFoundPage } from '@/app/pages/not-found-page'
import { RootRedirectPage } from '@/app/pages/root-redirect'
import { UnauthorizedPage } from '@/app/pages/unauthorized-page'
import { protectedRoutes, publicRoutes } from '@/app/router/route-registry'
import { ROUTE_PATHS } from '@/app/router/route-paths'

export const router = createBrowserRouter([
  { path: '/', Component: RootRedirectPage },
  { element: <AuthLayout />, children: publicRoutes },
  {
    path: ROUTE_PATHS.appRoot,
    element: <DashboardLayout />,
    children: [
      { index: true, Component: RootRedirectPage },
      ...protectedRoutes,
    ],
  },
  { path: ROUTE_PATHS.unauthorized, Component: UnauthorizedPage },
  { path: '*', Component: NotFoundPage },
])
