export const APP_ACTIONS = Object.freeze({
  view: 'view',
  create: 'create',
  edit: 'edit',
  delete: 'delete',
  publish: 'publish',
  distributeProfits: 'distribute_profits',
})

export const APP_RESOURCES = Object.freeze({
  auth: 'auth',
  dashboard: 'dashboard',
  users: 'users',
  investmentOpportunities: 'investment_opportunities',
  profitDistributions: 'profit_distributions',
  activityLogs: 'activity_logs',
  notifications: 'notifications',
})

export const APP_ROLES = Object.freeze({
  superAdmin: 'super_admin',
  operationsAdmin: 'operations_admin',
  investmentManager: 'investment_manager',
  readOnlyViewer: 'read_only_viewer',
})

export function createPermission(resource, action) {
  return { resource, action }
}
