import { useEffect, useState } from 'react'

import {
  createInitialDashboardNotifications,
  createLiveDashboardNotification,
  filterRetainedDashboardNotifications,
  selectDashboardBarNotifications,
} from '@/features/notifications/constants/dashboard-notifications'
import { NotificationsContext } from '@/features/notifications/context/notifications-context'

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() =>
    createInitialDashboardNotifications(),
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const liveNotification = createLiveDashboardNotification(new Date())

      setNotifications((currentNotifications) => [
        liveNotification,
        ...currentNotifications.filter(
          (notification) => notification.id !== liveNotification.id,
        ),
      ])
    }, 5000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  const allNotifications = filterRetainedDashboardNotifications(notifications)
  const barNotifications = selectDashboardBarNotifications(allNotifications)
  const unreadCount = allNotifications.filter(
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

  return (
    <NotificationsContext.Provider
      value={{
        allNotifications,
        barNotifications,
        unreadCount,
        hasUnread: unreadCount > 0,
        markNotificationAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}
