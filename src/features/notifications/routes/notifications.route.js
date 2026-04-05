import { Bell } from 'lucide-react'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'

export const notificationsRouteMeta = {
  key: 'notifications',
  path: ROUTE_PATHS.notifications,
  titleKey: 'navigation.notifications',
  breadcrumbKey: 'navigation.notifications',
  descriptionKey: 'placeholderMessage',
  showInNav: true,
  icon: Bell,
  requiredPermissions: [
    createPermission(APP_RESOURCES.notifications, APP_ACTIONS.view),
  ],
}

export const notificationsRoute = {
  path: 'notifications',
  async lazy() {
    const module =
      await import('@/features/notifications/pages/notifications-page')
    return { Component: module.default, handle: notificationsRouteMeta }
  },
}
