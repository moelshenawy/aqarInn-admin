import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AuthLayout } from '@/app/layouts/auth-layout'
import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { NotFoundPage } from '@/app/pages/not-found-page'
import { RootRedirectPage } from '@/app/pages/root-redirect'
import { UnauthorizedPage } from '@/app/pages/unauthorized-page'
import { protectedRoutes, publicRoutes } from '@/app/router/route-registry'
import { ROUTE_PATHS } from '@/app/router/route-paths'

// Top-level optional locale param
export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, Component: RootRedirectPage },
      { element: <AuthLayout />, children: publicRoutes },
      {
        path: ROUTE_PATHS.appRoot.replace(/^\//, ''),
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <Navigate to={ROUTE_PATHS.dashboard.replace(/^\//, '')} replace />
            ),
          },
          ...protectedRoutes,
        ],
      },
      {
        path: ROUTE_PATHS.unauthorized.replace(/^\//, ''),
        Component: UnauthorizedPage,
      },
      { path: '*', Component: NotFoundPage },
    ],
  },

  {
    path: '/:locale',
    children: [
      { index: true, Component: RootRedirectPage },
      { element: <AuthLayout />, children: publicRoutes },
      {
        path: ROUTE_PATHS.appRoot.replace(/^\//, ''),
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <Navigate to={ROUTE_PATHS.dashboard.replace(/^\//, '')} replace />
            ),
          },
          ...protectedRoutes,
        ],
      },
      {
        path: ROUTE_PATHS.unauthorized.replace(/^\//, ''),
        Component: UnauthorizedPage,
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
