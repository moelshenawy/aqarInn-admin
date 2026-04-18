import { MapPin } from 'lucide-react'

import { ROUTE_PATHS } from '@/app/router/route-paths'

export const citiesRouteMeta = {
  key: 'cities',
  path: ROUTE_PATHS.cities,
  titleKey: 'cities',
  breadcrumbKey: 'cities',
  descriptionKey: 'citiesPage.description',
  showInNav: true,
  icon: MapPin,
}

export const citiesRoute = {
  path: 'cities',
  async lazy() {
    const module = await import('@/features/cities/pages/cities-page')
    return { Component: module.default, handle: citiesRouteMeta }
  },
}
