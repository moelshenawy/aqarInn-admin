import { ClipboardList } from 'lucide-react'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'

export const activityLogsRouteMeta = {
  key: 'activity-logs',
  path: ROUTE_PATHS.activityLogs,
  titleKey: 'navigation.activityLogs',
  breadcrumbKey: 'navigation.activityLogs',
  descriptionKey: 'placeholderMessage',
  showInNav: true,
  icon: ClipboardList,
  requiredPermissions: [
    createPermission(APP_RESOURCES.activityLogs, APP_ACTIONS.view),
  ],
}

export const activityLogsRoute = {
  path: 'activity-logs',
  async lazy() {
    const module =
      await import('@/features/activity-logs/pages/activity-logs-page')
    return { Component: module.default, handle: activityLogsRouteMeta }
  },
}
