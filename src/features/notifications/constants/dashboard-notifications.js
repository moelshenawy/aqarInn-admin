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
export const DASHBOARD_NOTIFICATIONS_RETENTION_MONTHS = 6
export const DASHBOARD_NOTIFICATIONS_REFERENCE_DATE = new Date(
  '2026-04-12T12:00:00.000Z',
)

function createNotificationDate(minutesAgo) {
  const nextDate = new Date(DASHBOARD_NOTIFICATIONS_REFERENCE_DATE)
  nextDate.setMinutes(nextDate.getMinutes() - minutesAgo)
  return nextDate.toISOString()
}

function createNotificationSeed({
  minutesAgo,
  kind,
  isRead,
  iconSrc,
  targetPath,
  ...item
}) {
  return {
    ...item,
    kind,
    createdAt: createNotificationDate(minutesAgo),
    isRead,
    iconSrc,
    targetPath,
    titleKey: `notificationsBar.items.${kind}.title`,
    bodyKey: `notificationsBar.items.${kind}.body`,
  }
}
const notificationSeedDefinitions = []
// const notificationSeedDefinitions = [
//   {
//     id: 'notification-001',
//     kind: 'fundingMilestone',
//     minutesAgo: 5,
//     isRead: false,
//     iconSrc: barChartIcon,
//     targetPath: buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
//   },
//   {
//     id: 'notification-002',
//     kind: 'opportunityPublished',
//     minutesAgo: 12,
//     isRead: false,
//     iconSrc: homeIcon,
//     targetPath: buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
//   },
//   {
//     id: 'notification-003',
//     kind: 'distributionReady',
//     minutesAgo: 24,
//     isRead: false,
//     iconSrc: trophyIcon,
//     targetPath: buildInvestmentOpportunityProfitDistributionsPath(
//       'investment-riyadh-001',
//     ),
//   },
//   {
//     id: 'notification-004',
//     kind: 'withdrawalInProgress',
//     minutesAgo: 38,
//     isRead: false,
//     iconSrc: glassesIcon,
//     targetPath: ROUTE_PATHS.activityLogs,
//   },
//   {
//     id: 'notification-005',
//     kind: 'kycApproved',
//     minutesAgo: 55,
//     isRead: false,
//     iconSrc: trophyIcon,
//     targetPath: ROUTE_PATHS.users,
//   },
//   {
//     id: 'notification-006',
//     kind: 'activityReview',
//     minutesAgo: 73,
//     isRead: true,
//     iconSrc: glassesIcon,
//     targetPath: ROUTE_PATHS.activityLogs,
//   },
//   {
//     id: 'notification-007',
//     kind: 'systemUpdate',
//     minutesAgo: 96,
//     isRead: true,
//     iconSrc: glassesIcon,
//     targetPath: ROUTE_PATHS.notifications,
//   },
//   {
//     id: 'notification-008',
//     kind: 'newUserRequest',
//     minutesAgo: 128,
//     isRead: false,
//     iconSrc: homeIcon,
//     targetPath: ROUTE_PATHS.users,
//   },
//   {
//     id: 'notification-009',
//     kind: 'withdrawalDeposited',
//     minutesAgo: 154,
//     isRead: true,
//     iconSrc: barChartIcon,
//     targetPath: ROUTE_PATHS.activityLogs,
//   },
//   {
//     id: 'notification-010',
//     kind: 'fundingMilestone',
//     minutesAgo: 188,
//     isRead: true,
//     iconSrc: barChartIcon,
//     targetPath: buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
//   },
//   {
//     id: 'notification-011',
//     kind: 'opportunityPublished',
//     minutesAgo: 235,
//     isRead: true,
//     iconSrc: homeIcon,
//     targetPath: buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
//   },
//   {
//     id: 'notification-012',
//     kind: 'distributionReady',
//     minutesAgo: 286,
//     isRead: false,
//     iconSrc: trophyIcon,
//     targetPath: buildInvestmentOpportunityProfitDistributionsPath(
//       'investment-riyadh-001',
//     ),
//   },
//   {
//     id: 'notification-013',
//     kind: 'withdrawalInProgress',
//     minutesAgo: 342,
//     isRead: true,
//     iconSrc: glassesIcon,
//     targetPath: ROUTE_PATHS.activityLogs,
//   },
//   {
//     id: 'notification-014',
//     kind: 'systemUpdate',
//     minutesAgo: 410,
//     isRead: true,
//     iconSrc: glassesIcon,
//     targetPath: ROUTE_PATHS.notifications,
//   },
//   {
//     id: 'notification-015',
//     kind: 'kycApproved',
//     minutesAgo: 489,
//     isRead: true,
//     iconSrc: trophyIcon,
//     targetPath: ROUTE_PATHS.users,
//   },
//   {
//     id: 'notification-016',
//     kind: 'activityReview',
//     minutesAgo: 610,
//     isRead: true,
//     iconSrc: glassesIcon,
//     targetPath: ROUTE_PATHS.activityLogs,
//   },
//   {
//     id: 'notification-017',
//     kind: 'newUserRequest',
//     minutesAgo: 880,
//     isRead: true,
//     iconSrc: homeIcon,
//     targetPath: ROUTE_PATHS.users,
//   },
//   {
//     id: 'notification-018',
//     kind: 'withdrawalDeposited',
//     minutesAgo: 1210,
//     isRead: true,
//     iconSrc: barChartIcon,
//     targetPath: ROUTE_PATHS.activityLogs,
//   },
//   {
//     id: 'notification-019',
//     kind: 'systemUpdate',
//     minutesAgo: 1750,
//     isRead: true,
//     iconSrc: glassesIcon,
//     targetPath: ROUTE_PATHS.notifications,
//   },
//   {
//     id: 'notification-020',
//     kind: 'activityReview',
//     minutesAgo: 2510,
//     isRead: true,
//     iconSrc: glassesIcon,
//     targetPath: ROUTE_PATHS.activityLogs,
//   },
//   {
//     id: 'notification-021',
//     kind: 'fundingMilestone',
//     minutesAgo: 40960,
//     isRead: true,
//     iconSrc: barChartIcon,
//     targetPath: buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
//   },
//   {
//     id: 'notification-022',
//     kind: 'opportunityPublished',
//     minutesAgo: 80640,
//     isRead: true,
//     iconSrc: homeIcon,
//     targetPath: buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
//   },
//   {
//     id: 'notification-023',
//     kind: 'distributionReady',
//     minutesAgo: 129600,
//     isRead: true,
//     iconSrc: trophyIcon,
//     targetPath: buildInvestmentOpportunityProfitDistributionsPath(
//       'investment-riyadh-001',
//     ),
//   },
//   {
//     id: 'notification-024',
//     kind: 'systemUpdate',
//     minutesAgo: 216000,
//     isRead: true,
//     iconSrc: glassesIcon,
//     targetPath: ROUTE_PATHS.notifications,
//   },
//   {
//     id: 'notification-025',
//     kind: 'systemUpdate',
//     minutesAgo: 280000,
//     isRead: true,
//     iconSrc: glassesIcon,
//     targetPath: ROUTE_PATHS.notifications,
//   },
// ].map(createNotificationSeed)

function toReferenceDate(
  referenceDate = DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
) {
  return new Date(referenceDate)
}

export function sortDashboardNotifications(items) {
  return [...items].sort(
    (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
  )
}

export function filterRetainedDashboardNotifications(
  items,
  referenceDate = DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
) {
  const retentionCutoff = toReferenceDate(referenceDate)
  retentionCutoff.setMonth(
    retentionCutoff.getMonth() - DASHBOARD_NOTIFICATIONS_RETENTION_MONTHS,
  )

  return sortDashboardNotifications(items).filter(
    (notification) => new Date(notification.createdAt) >= retentionCutoff,
  )
}

export function selectDashboardBarNotifications(
  items,
  referenceDate = DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
) {
  return filterRetainedDashboardNotifications(items, referenceDate).slice(
    0,
    DASHBOARD_NOTIFICATIONS_MAX_ITEMS,
  )
}

export function sortAndLimitDashboardNotifications(
  items,
  referenceDate = DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
) {
  return selectDashboardBarNotifications(items, referenceDate)
}

export function createInitialDashboardNotifications(
  referenceDate = DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
) {
  return filterRetainedDashboardNotifications(
    notificationSeedDefinitions,
    referenceDate,
  )
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
