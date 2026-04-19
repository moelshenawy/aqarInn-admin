import {
  APP_ACTIONS,
  APP_RESOURCES,
  APP_ROLES,
} from '@/lib/permissions/constants'

const allResourceActions = Object.values(APP_RESOURCES).flatMap((resource) =>
  Object.values(APP_ACTIONS).map((action) => ({ resource, action })),
)

export const rolePermissions = {
  [APP_ROLES.superAdmin]: allResourceActions,
  [APP_ROLES.operationsAdmin]: [
    {
      resource: APP_RESOURCES.investmentOpportunities,
      action: APP_ACTIONS.view,
    },
    {
      resource: APP_RESOURCES.investmentOpportunities,
      action: APP_ACTIONS.create,
    },
    {
      resource: APP_RESOURCES.investmentOpportunities,
      action: APP_ACTIONS.edit,
    },
    {
      resource: APP_RESOURCES.investmentOpportunities,
      action: APP_ACTIONS.delete,
    },
    {
      resource: APP_RESOURCES.investmentOpportunities,
      action: APP_ACTIONS.publish,
    },
    { resource: APP_RESOURCES.activityLogs, action: APP_ACTIONS.view },
    { resource: APP_RESOURCES.notifications, action: APP_ACTIONS.view },
  ],
  [APP_ROLES.investmentManager]: [
    {
      resource: APP_RESOURCES.investmentOpportunities,
      action: APP_ACTIONS.view,
    },
    { resource: APP_RESOURCES.profitDistributions, action: APP_ACTIONS.view },
    {
      resource: APP_RESOURCES.profitDistributions,
      action: APP_ACTIONS.distributeProfits,
    },
    { resource: APP_RESOURCES.notifications, action: APP_ACTIONS.view },
  ],
  [APP_ROLES.readOnlyViewer]: [
    {
      resource: APP_RESOURCES.investmentOpportunities,
      action: APP_ACTIONS.view,
    },
    { resource: APP_RESOURCES.profitDistributions, action: APP_ACTIONS.view },
    { resource: APP_RESOURCES.activityLogs, action: APP_ACTIONS.view },
    { resource: APP_RESOURCES.notifications, action: APP_ACTIONS.view },
  ],
}
