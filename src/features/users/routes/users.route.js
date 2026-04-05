import { Users } from 'lucide-react'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'

export const usersRouteMeta = {
  key: 'users',
  path: ROUTE_PATHS.users,
  titleKey: 'navigation.users',
  breadcrumbKey: 'navigation.users',
  descriptionKey: 'placeholderMessage',
  showInNav: true,
  icon: Users,
  requiredPermissions: [
    createPermission(APP_RESOURCES.users, APP_ACTIONS.view),
  ],
}

export const usersRoute = {
  path: 'users',
  async lazy() {
    const module = await import('@/features/users/pages/users-page')
    return { Component: module.default, handle: usersRouteMeta }
  },
}
