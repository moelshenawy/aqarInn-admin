import { LayoutDashboard } from 'lucide-react'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'

export const dashboardRouteMeta = {
  key: 'dashboard',
  path: ROUTE_PATHS.dashboard,
  titleKey: 'navigation.dashboard',
  breadcrumbKey: 'navigation.dashboard',
  descriptionKey: 'shellReady',
  showInNav: true,
  icon: LayoutDashboard,
  requiredPermissions: [
    createPermission(APP_RESOURCES.dashboard, APP_ACTIONS.view),
  ],
}

export const dashboardRoute = {
  path: 'dashboard',
  async lazy() {
    const module = await import('@/features/dashboard/pages/dashboard-page')
    return { Component: module.default, handle: dashboardRouteMeta }
  },
}
