import { HandCoins } from 'lucide-react'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'

export const profitDistributionsRouteMeta = {
  key: 'profit-distributions',
  path: ROUTE_PATHS.profitDistributions,
  titleKey: 'navigation.profitDistributions',
  breadcrumbKey: 'navigation.profitDistributions',
  descriptionKey: 'placeholderMessage',
  showInNav: true,
  icon: HandCoins,
  requiredPermissions: [
    createPermission(APP_RESOURCES.profitDistributions, APP_ACTIONS.view),
  ],
}

export const profitDistributionsRoute = {
  path: 'profit-distributions',
  async lazy() {
    const module =
      await import('@/features/profit-distributions/pages/profit-distributions-page')
    return { Component: module.default, handle: profitDistributionsRouteMeta }
  },
}
