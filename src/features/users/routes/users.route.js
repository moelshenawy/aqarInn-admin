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

export const usersAddRouteMeta = {
  key: 'users-add',
  path: ROUTE_PATHS.usersAdd,
  titleKey: 'navigation.users',
  breadcrumbKey: 'navigation.users',
  descriptionKey: 'placeholderMessage',
  showInNav: false,
  icon: Users,
  requiredPermissions: [
    createPermission(APP_RESOURCES.users, APP_ACTIONS.create),
  ],
}

export const usersRoute = {
  path: 'users',
  async lazy() {
    const module = await import('@/features/users/pages/users-page')
    return { Component: module.default, handle: usersRouteMeta }
  },
}

export const usersAddRoute = {
  path: 'users/add',
  async lazy() {
    const module = await import('@/features/users/pages/users-add-page')
    return { Component: module.default, handle: usersAddRouteMeta }
  },
}
