import { BriefcaseBusiness } from 'lucide-react'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'

export const investmentOpportunitiesRouteMeta = {
  key: 'investment-opportunities',
  path: ROUTE_PATHS.investmentOpportunities,
  titleKey: 'navigation.investmentOpportunities',
  breadcrumbKey: 'navigation.investmentOpportunities',
  descriptionKey: 'placeholderMessage',
  showInNav: true,
  icon: BriefcaseBusiness,
  requiredPermissions: [
    createPermission(APP_RESOURCES.investmentOpportunities, APP_ACTIONS.view),
  ],
}

export const investmentOpportunitiesRoute = {
  path: 'investment-opportunities',
  async lazy() {
    const module =
      await import('@/features/investment-opportunities/pages/investment-opportunities-page')
    return {
      Component: module.default,
      handle: investmentOpportunitiesRouteMeta,
    }
  },
}
