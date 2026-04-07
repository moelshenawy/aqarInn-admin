export const ROUTE_PATHS = {
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  unauthorized: '/unauthorized',
  appRoot: '/app',
  dashboard: '/app/dashboard',
  users: '/app/users',
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
}

export function buildInvestmentOpportunityDetailsPath(opportunityId) {
  return `/app/investment-opportunities/${encodeURIComponent(opportunityId)}`
}

export function buildInvestmentOpportunityEditPath(opportunityId) {
  return `${buildInvestmentOpportunityDetailsPath(opportunityId)}/edit`
}

export function buildInvestmentOpportunityProfitDistributionsPath(opportunityId) {
  return `${buildInvestmentOpportunityDetailsPath(opportunityId)}/profit-distributions`
}
