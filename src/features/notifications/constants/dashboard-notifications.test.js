import { describe, expect, it } from 'vitest'

import {
  createInitialDashboardNotifications,
  createLiveDashboardNotification,
  DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
  filterRetainedDashboardNotifications,
  selectDashboardBarNotifications,
} from '@/features/notifications/constants/dashboard-notifications'

describe('dashboard notifications selectors', () => {
  it('keeps the full notifications list longer than the bell menu list', () => {
    const allNotifications = createInitialDashboardNotifications(
      DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
    )
    const barNotifications = selectDashboardBarNotifications(
      allNotifications,
      DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
    )

    expect(allNotifications).toHaveLength(24)
    expect(barNotifications).toHaveLength(20)
    expect(allNotifications[0].id).toBe('notification-001')
    expect(allNotifications.at(-1).id).toBe('notification-024')
    expect(barNotifications[0].id).toBe('notification-001')
    expect(barNotifications.at(-1).id).toBe('notification-020')
  })

  it('filters out notifications older than six months', () => {
    const retainedNotifications = filterRetainedDashboardNotifications(
      [
        { id: 'recent-notification', createdAt: '2026-03-01T09:00:00.000Z' },
        { id: 'stale-notification', createdAt: '2025-09-30T09:00:00.000Z' },
      ],
      DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
    )

    expect(
      retainedNotifications.map((notification) => notification.id),
    ).toEqual(['recent-notification'])
  })

  it('keeps the bell menu capped when a live notification arrives', () => {
    const allNotifications = createInitialDashboardNotifications(
      DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
    )
    const liveNotification = createLiveDashboardNotification(
      DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
    )

    const nextBarNotifications = selectDashboardBarNotifications(
      [liveNotification, ...allNotifications],
      DASHBOARD_NOTIFICATIONS_REFERENCE_DATE,
    )

    expect(nextBarNotifications).toHaveLength(20)
    expect(nextBarNotifications[0].id).toBe('notification-live-001')
    expect(
      nextBarNotifications.some(
        (notification) => notification.id === 'notification-020',
      ),
    ).toBe(false)
  })
})
