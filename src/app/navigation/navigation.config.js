import { activityLogsRouteMeta } from '@/features/activity-logs/routes/activity-logs.route'
import { dashboardRouteMeta } from '@/features/dashboard/routes/dashboard.route'
import { investmentOpportunitiesRouteMeta } from '@/features/investment-opportunities/routes/investment-opportunities.route'
import { notificationsRouteMeta } from '@/features/notifications/routes/notifications.route'
import { profitDistributionsRouteMeta } from '@/features/profit-distributions/routes/profit-distributions.route'
import { usersRouteMeta } from '@/features/users/routes/users.route'

export const navigationItems = [
  dashboardRouteMeta,
  usersRouteMeta,
  investmentOpportunitiesRouteMeta,
  profitDistributionsRouteMeta,
  activityLogsRouteMeta,
  notificationsRouteMeta,
].filter((item) => item.showInNav)
