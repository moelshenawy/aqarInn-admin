import { MapPin } from 'lucide-react'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'

export const citiesRouteMeta = {
  key: 'cities',
  path: ROUTE_PATHS.cities,
  titleKey: 'navigation.cities',
  breadcrumbKey: 'navigation.cities',
  descriptionKey: 'navigation.citiesPage.description',
  showInNav: true,
  icon: MapPin,
  requiredPermissions: [
    createPermission(APP_RESOURCES.cities, APP_ACTIONS.view),
  ],
}

export const citiesRoute = {
  path: 'cities',
  async lazy() {
    const module = await import('@/features/cities/pages/cities-page')
    return { Component: module.default, handle: citiesRouteMeta }
  },
}
