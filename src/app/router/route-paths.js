// Helper to add locale prefix
function withLocale(path, locale) {
  if (locale === 'en') {
    return path.startsWith('/en') ? path : '/en' + (path === '/' ? '' : path)
  }
  return path.startsWith('/en') ? path.replace(/^\/en/, '') || '/' : path
}

export const ROUTE_PATHS = {
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  unauthorized: '/unauthorized',
  appRoot: '/app',
  dashboard: '/app/dashboard',
  users: '/app/users',
  usersAdd: '/app/users/add',
  cities: '/app/cities',
  investmentOpportunities: '/app/investment-opportunities',
  investmentOpportunityAdd: '/app/investment-opportunities/add',
  investmentOpportunityDetails: '/app/investment-opportunities/:opportunityId',
  investmentOpportunityEdit:
    '/app/investment-opportunities/:opportunityId/edit',
  investmentOpportunityProfitDistributions:
    '/app/investment-opportunities/:opportunityId/profit-distributions',
  profitDistributions: '/app/profit-distributions',
  activityLogs: '/app/activity-logs',
  notifications: '/app/notifications',
  withLocale,
}

export function buildInvestmentOpportunityDetailsPath(opportunityId, locale) {
  return ROUTE_PATHS.withLocale(
    `/app/investment-opportunities/${encodeURIComponent(opportunityId)}`,
    locale,
  )
}

export function buildInvestmentOpportunityEditPath(opportunityId, locale) {
  return ROUTE_PATHS.withLocale(
    `${buildInvestmentOpportunityDetailsPath(opportunityId)}/edit`,
    locale,
  )
}

export function buildInvestmentOpportunityProfitDistributionsPath(
  opportunityId,
  locale,
) {
  return ROUTE_PATHS.withLocale(
    `${buildInvestmentOpportunityDetailsPath(opportunityId)}/profit-distributions`,
    locale,
  )
}
