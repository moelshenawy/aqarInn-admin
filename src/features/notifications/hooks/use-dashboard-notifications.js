import { useEffect, useState } from 'react'

import {
  createInitialDashboardNotifications,
  createLiveDashboardNotification,
  sortAndLimitDashboardNotifications,
} from '@/features/notifications/constants/dashboard-notifications'

export function useDashboardNotifications() {
  const [notifications, setNotifications] = useState(() =>
    createInitialDashboardNotifications(),
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const liveNotification = createLiveDashboardNotification(new Date())

      setNotifications((currentNotifications) =>
        sortAndLimitDashboardNotifications([
          liveNotification,
          ...currentNotifications.filter(
            (notification) => notification.id !== liveNotification.id,
          ),
        ]),
      )
    }, 5000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length

  function markNotificationAsRead(notificationId) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    )
  }

  function markAllAsRead() {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    )
  }

  return {
    notifications,
    unreadCount,
    hasUnread: unreadCount > 0,
    markNotificationAsRead,
    markAllAsRead,
  }
}
