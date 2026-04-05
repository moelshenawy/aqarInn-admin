import { forgotPasswordRoute } from '@/features/auth/routes/forgot-password.route'
import { loginRoute } from '@/features/auth/routes/login.route'
import { resetPasswordRoute } from '@/features/auth/routes/reset-password.route'
import { activityLogsRoute } from '@/features/activity-logs/routes/activity-logs.route'
import { dashboardRoute } from '@/features/dashboard/routes/dashboard.route'
import { investmentOpportunitiesRoute } from '@/features/investment-opportunities/routes/investment-opportunities.route'
import { notificationsRoute } from '@/features/notifications/routes/notifications.route'
import { profitDistributionsRoute } from '@/features/profit-distributions/routes/profit-distributions.route'
import { usersRoute } from '@/features/users/routes/users.route'

export const publicRoutes = [
  loginRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
]
export const protectedRoutes = [
  dashboardRoute,
  usersRoute,
  investmentOpportunitiesRoute,
  profitDistributionsRoute,
  activityLogsRoute,
  notificationsRoute,
]
