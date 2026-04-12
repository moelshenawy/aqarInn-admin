import barChartIcon from '@/features/notifications/assets/bar-chart-07.svg'
import glassesIcon from '@/features/notifications/assets/glasses-02.svg'
import homeIcon from '@/features/notifications/assets/home-05.svg'
import trophyIcon from '@/features/notifications/assets/trophy-01.svg'
import {
  buildInvestmentOpportunityDetailsPath,
  buildInvestmentOpportunityProfitDistributionsPath,
  ROUTE_PATHS,
} from '@/app/router/route-paths'

export const DASHBOARD_NOTIFICATIONS_MAX_ITEMS = 20
const DASHBOARD_NOTIFICATIONS_ANCHOR = new Date('2026-04-12T12:00:00.000Z')

function createNotificationDate(minutesAgo) {
  const nextDate = new Date(DASHBOARD_NOTIFICATIONS_ANCHOR)
  nextDate.setMinutes(nextDate.getMinutes() - minutesAgo)
  return nextDate.toISOString()
}

const notificationSeedDefinitions = [
  {
    id: 'notification-001',
    kind: 'fundingMilestone',
    createdAt: createNotificationDate(5),
    isRead: false,
    iconSrc: barChartIcon,
    targetPath: buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
    titleKey: 'notificationsBar.items.fundingMilestone.title',
    bodyKey: 'notificationsBar.items.fundingMilestone.body',
  },
  {
    id: 'notification-002',
    kind: 'opportunityPublished',
    createdAt: createNotificationDate(12),
    isRead: false,
    iconSrc: homeIcon,
    targetPath: buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
    titleKey: 'notificationsBar.items.opportunityPublished.title',
    bodyKey: 'notificationsBar.items.opportunityPublished.body',
  },
  {
    id: 'notification-003',
    kind: 'distributionReady',
    createdAt: createNotificationDate(24),
    isRead: false,
    iconSrc: trophyIcon,
    targetPath:
      buildInvestmentOpportunityProfitDistributionsPath(
        'investment-riyadh-001',
      ),
    titleKey: 'notificationsBar.items.distributionReady.title',
    bodyKey: 'notificationsBar.items.distributionReady.body',
  },
  {
    id: 'notification-004',
    kind: 'withdrawalInProgress',
    createdAt: createNotificationDate(38),
    isRead: false,
    iconSrc: glassesIcon,
    targetPath: ROUTE_PATHS.activityLogs,
    titleKey: 'notificationsBar.items.withdrawalInProgress.title',
    bodyKey: 'notificationsBar.items.withdrawalInProgress.body',
  },
  {
    id: 'notification-005',
    kind: 'kycApproved',
    createdAt: createNotificationDate(55),
    isRead: false,
    iconSrc: trophyIcon,
    targetPath: ROUTE_PATHS.users,
    titleKey: 'notificationsBar.items.kycApproved.title',
    bodyKey: 'notificationsBar.items.kycApproved.body',
  },
  {
    id: 'notification-006',
    kind: 'activityReview',
    createdAt: createNotificationDate(73),
    isRead: true,
    iconSrc: glassesIcon,
    targetPath: ROUTE_PATHS.activityLogs,
    titleKey: 'notificationsBar.items.activityReview.title',
    bodyKey: 'notificationsBar.items.activityReview.body',
  },
  {
    id: 'notification-007',
    kind: 'systemUpdate',
    createdAt: createNotificationDate(96),
    isRead: true,
    iconSrc: glassesIcon,
    targetPath: ROUTE_PATHS.notifications,
    titleKey: 'notificationsBar.items.systemUpdate.title',
    bodyKey: 'notificationsBar.items.systemUpdate.body',
  },
  {
    id: 'notification-008',
    kind: 'newUserRequest',
    createdAt: createNotificationDate(128),
    isRead: false,
    iconSrc: homeIcon,
    targetPath: ROUTE_PATHS.users,
    titleKey: 'notificationsBar.items.newUserRequest.title',
    bodyKey: 'notificationsBar.items.newUserRequest.body',
  },
  {
    id: 'notification-009',
    kind: 'withdrawalDeposited',
    createdAt: createNotificationDate(154),
    isRead: true,
    iconSrc: barChartIcon,
    targetPath: ROUTE_PATHS.activityLogs,
    titleKey: 'notificationsBar.items.withdrawalDeposited.title',
    bodyKey: 'notificationsBar.items.withdrawalDeposited.body',
  },
  {
    id: 'notification-010',
    kind: 'fundingMilestone',
    createdAt: createNotificationDate(188),
    isRead: true,
    iconSrc: barChartIcon,
    targetPath: buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
    titleKey: 'notificationsBar.items.fundingMilestone.title',
    bodyKey: 'notificationsBar.items.fundingMilestone.body',
  },
  {
    id: 'notification-011',
    kind: 'opportunityPublished',
    createdAt: createNotificationDate(235),
    isRead: true,
    iconSrc: homeIcon,
    targetPath: buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
    titleKey: 'notificationsBar.items.opportunityPublished.title',
    bodyKey: 'notificationsBar.items.opportunityPublished.body',
  },
  {
    id: 'notification-012',
    kind: 'distributionReady',
    createdAt: createNotificationDate(286),
    isRead: false,
    iconSrc: trophyIcon,
    targetPath:
      buildInvestmentOpportunityProfitDistributionsPath(
        'investment-riyadh-001',
      ),
    titleKey: 'notificationsBar.items.distributionReady.title',
    bodyKey: 'notificationsBar.items.distributionReady.body',
  },
  {
    id: 'notification-013',
    kind: 'withdrawalInProgress',
    createdAt: createNotificationDate(342),
    isRead: true,
    iconSrc: glassesIcon,
    targetPath: ROUTE_PATHS.activityLogs,
    titleKey: 'notificationsBar.items.withdrawalInProgress.title',
    bodyKey: 'notificationsBar.items.withdrawalInProgress.body',
  },
  {
    id: 'notification-014',
    kind: 'systemUpdate',
    createdAt: createNotificationDate(410),
    isRead: true,
    iconSrc: glassesIcon,
    targetPath: ROUTE_PATHS.notifications,
    titleKey: 'notificationsBar.items.systemUpdate.title',
    bodyKey: 'notificationsBar.items.systemUpdate.body',
  },
  {
    id: 'notification-015',
    kind: 'kycApproved',
    createdAt: createNotificationDate(489),
    isRead: true,
    iconSrc: trophyIcon,
    targetPath: ROUTE_PATHS.users,
    titleKey: 'notificationsBar.items.kycApproved.title',
    bodyKey: 'notificationsBar.items.kycApproved.body',
  },
  {
    id: 'notification-016',
    kind: 'activityReview',
    createdAt: createNotificationDate(610),
    isRead: true,
    iconSrc: glassesIcon,
    targetPath: ROUTE_PATHS.activityLogs,
    titleKey: 'notificationsBar.items.activityReview.title',
    bodyKey: 'notificationsBar.items.activityReview.body',
  },
  {
    id: 'notification-017',
    kind: 'newUserRequest',
    createdAt: createNotificationDate(880),
    isRead: true,
    iconSrc: homeIcon,
    targetPath: ROUTE_PATHS.users,
    titleKey: 'notificationsBar.items.newUserRequest.title',
    bodyKey: 'notificationsBar.items.newUserRequest.body',
  },
  {
    id: 'notification-018',
    kind: 'withdrawalDeposited',
    createdAt: createNotificationDate(1210),
    isRead: true,
    iconSrc: barChartIcon,
    targetPath: ROUTE_PATHS.activityLogs,
    titleKey: 'notificationsBar.items.withdrawalDeposited.title',
    bodyKey: 'notificationsBar.items.withdrawalDeposited.body',
  },
  {
    id: 'notification-019',
    kind: 'systemUpdate',
    createdAt: createNotificationDate(1750),
    isRead: true,
    iconSrc: glassesIcon,
    targetPath: ROUTE_PATHS.notifications,
    titleKey: 'notificationsBar.items.systemUpdate.title',
    bodyKey: 'notificationsBar.items.systemUpdate.body',
  },
]

export function sortAndLimitDashboardNotifications(items) {
  return [...items]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, DASHBOARD_NOTIFICATIONS_MAX_ITEMS)
}

export function createInitialDashboardNotifications() {
  return sortAndLimitDashboardNotifications(notificationSeedDefinitions)
}

export function createLiveDashboardNotification(referenceDate = new Date()) {
  return {
    id: 'notification-live-001',
    kind: 'liveOperationalAlert',
    createdAt: new Date(referenceDate).toISOString(),
    isRead: false,
    iconSrc: glassesIcon,
    targetPath: ROUTE_PATHS.notifications,
    titleKey: 'notificationsBar.items.liveOperationalAlert.title',
    bodyKey: 'notificationsBar.items.liveOperationalAlert.body',
  }
}

export function formatDashboardNotificationDateTime(createdAt, language) {
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt))
}
