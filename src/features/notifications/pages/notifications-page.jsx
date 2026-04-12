import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { NotificationListItem } from '@/features/notifications/components/notification-list-item'
import { useNotifications } from '@/features/notifications/hooks/use-notifications'
import { useDirection } from '@/lib/i18n/direction-provider'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/shared/components/page-header'

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('notifications')
  const { dir } = useDirection()
  const {
    allNotifications,
    unreadCount,
    hasUnread,
    markNotificationAsRead,
    markAllAsRead,
  } = useNotifications()

  function handleNotificationSelect(notification) {
    markNotificationAsRead(notification.id)
    navigate(notification.targetPath)
  }

  return (
    <div data-slot="notifications-page-content" className="space-y-6" dir={dir}>
      <PageHeader
        titleKey="navigation:notifications"
        description={t('notificationsPage.description')}
        actions={
          <button
            type="button"
            disabled={!hasUnread}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#402f28] px-4 text-sm leading-5 font-semibold text-white shadow-[var(--dashboard-shadow)] transition hover:bg-[#4c382f] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[#c8bca8] disabled:text-white/70"
            onClick={markAllAsRead}
          >
            {t('notificationsPage.actions.markAllAsRead')}
          </button>
        }
      />

      <section
        data-slot="notifications-page-panel"
        className="overflow-hidden rounded-[12px] border border-[#d6cbb2] bg-[#f8f3e8] shadow-[var(--dashboard-shadow)]"
      >
        <header className="border-b border-[#d6cbb2] bg-[#efe7d8] px-6 py-5">
          <div
            className={cn(
              'flex flex-wrap items-center gap-3',
              dir === 'ltr' ? 'justify-between' : 'justify-between',
            )}
          >
            <div
              className={cn(
                'flex flex-wrap items-center gap-3',
                dir === 'ltr' ? 'text-left' : 'text-right',
              )}
            >
              <h2 className="text-lg leading-7 font-semibold text-[#181927]">
                {t('notificationsPage.list.title')}
              </h2>
              <span
                data-slot="notifications-page-count"
                className="rounded-full bg-white px-4 py-1.5 text-xs leading-[18px] font-medium text-[#6d4f3b] shadow-[var(--dashboard-shadow)]"
              >
                {t('notificationsPage.list.count', {
                  count: allNotifications.length,
                })}
              </span>
            </div>

            <span
              data-slot="notifications-page-unread-count"
              aria-live="polite"
              aria-atomic="true"
              className={cn(
                'rounded-full px-3 py-1 text-xs leading-[18px] font-medium shadow-[var(--dashboard-shadow)]',
                hasUnread
                  ? 'bg-[#402f28] text-[#f8f3e8]'
                  : 'bg-white text-[#876647]',
              )}
            >
              {t('notificationsBar.header.unreadCount', {
                count: unreadCount,
              })}
            </span>
          </div>
        </header>

        <div className="px-6 py-6">
          {allNotifications.length > 0 ? (
            <ul data-slot="notifications-page-list" className="space-y-3">
              {allNotifications.map((notification) => (
                <NotificationListItem
                  key={notification.id}
                  item={notification}
                  dir={dir}
                  context="page"
                  onSelect={handleNotificationSelect}
                />
              ))}
            </ul>
          ) : (
            <div className="rounded-[14px] border border-dashed border-[#d6cbb2] bg-white/60 px-6 py-10 text-center">
              <h3 className="text-base font-semibold text-[#181927]">
                {t('notificationsPage.empty.title')}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6d4f3b]">
                {t('notificationsPage.empty.description')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
