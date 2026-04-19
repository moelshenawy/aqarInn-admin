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

export const investmentOpportunityAddRouteMeta = {
  key: 'investment-opportunity-add',
  path: ROUTE_PATHS.investmentOpportunityAdd,
  titleKey: 'navigation.investmentOpportunities',
  breadcrumbKey: 'navigation.addInvestmentOpportunity',
  descriptionKey: 'placeholderMessage',
  showInNav: false,
  icon: BriefcaseBusiness,
  requiredPermissions: [
    createPermission(APP_RESOURCES.investmentOpportunities, APP_ACTIONS.create),
  ],
}

export const investmentOpportunityDetailsRouteMeta = {
  key: 'investment-opportunity-details',
  path: ROUTE_PATHS.investmentOpportunityDetails,
  titleKey: 'navigation.investmentOpportunities',
  breadcrumbKey: 'navigation.investmentOpportunities',
  descriptionKey: 'placeholderMessage',
  showInNav: false,
  icon: BriefcaseBusiness,
  requiredPermissions: [
    createPermission(APP_RESOURCES.investmentOpportunities, APP_ACTIONS.view),
  ],
}

export const investmentOpportunityEditRouteMeta = {
  key: 'investment-opportunity-edit',
  path: ROUTE_PATHS.investmentOpportunityEdit,
  titleKey: 'navigation.investmentOpportunities',
  breadcrumbKey: 'navigation.investmentOpportunities',
  descriptionKey: 'placeholderMessage',
  showInNav: false,
  icon: BriefcaseBusiness,
  requiredPermissions: [
    createPermission(APP_RESOURCES.investmentOpportunities, APP_ACTIONS.edit),
  ],
}

export const investmentOpportunityProfitDistributionsRouteMeta = {
  key: 'investment-opportunity-profit-distributions',
  path: ROUTE_PATHS.investmentOpportunityProfitDistributions,
  titleKey: 'navigation.investmentOpportunities',
  breadcrumbKey: 'navigation.investmentOpportunities',
  descriptionKey: 'placeholderMessage',
  showInNav: false,
  icon: BriefcaseBusiness,
  requiredPermissions: [
    createPermission(APP_RESOURCES.profitDistributions, APP_ACTIONS.view),
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

export const investmentOpportunityDetailsRoute = {
  path: 'investment-opportunities/:opportunityId',
  async lazy() {
    const module =
      await import('@/features/investment-opportunities/pages/investment-opportunity-details-page')
    return {
      Component: module.default,
      handle: investmentOpportunityDetailsRouteMeta,
    }
  },
}

export const investmentOpportunityEditRoute = {
  path: 'investment-opportunities/:opportunityId/edit',
  async lazy() {
    const module =
      await import('@/features/investment-opportunities/pages/investment-opportunity-edit-page')
    return {
      Component: module.default,
      handle: investmentOpportunityEditRouteMeta,
    }
  },
}

export const investmentOpportunityProfitDistributionsRoute = {
  path: 'investment-opportunities/:opportunityId/profit-distributions',
  async lazy() {
    const module =
      await import(
        '@/features/investment-opportunities/pages/investment-opportunity-profit-distributions-page'
      )
    return {
      Component: module.default,
      handle: investmentOpportunityProfitDistributionsRouteMeta,
    }
  },
}

export const investmentOpportunityAddRoute = {
  path: 'investment-opportunities/add',
  async lazy() {
    const module =
      await import('@/features/investment-opportunities/pages/investment-opportunity-add-page')
    return {
      Component: module.default,
      handle: investmentOpportunityAddRouteMeta,
    }
  },
}
