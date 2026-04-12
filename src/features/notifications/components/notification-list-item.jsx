import { useTranslation } from 'react-i18next'

import { formatDashboardNotificationDateTime } from '@/features/notifications/constants/dashboard-notifications'
import { cn } from '@/lib/utils'

export function NotificationListItem({
  item,
  dir,
  onSelect,
  context = 'menu',
}) {
  const { t, i18n } = useTranslation('notifications')
  const isUnread = !item.isRead
  const isPageItem = context === 'page'

  return (
    <li>
      <button
        type="button"
        data-slot={
          isPageItem ? 'notifications-page-item' : 'dashboard-notification-item'
        }
        data-notification-context={context}
        data-notification-id={item.id}
        data-state={isUnread ? 'unread' : 'read'}
        className={cn(
          'flex w-full items-start gap-4 rounded-[14px] border text-inherit transition-colors focus-visible:ring-2 focus-visible:ring-[#9d7e55]/20 focus-visible:outline-none',
          isPageItem ? 'p-4 sm:p-5' : 'p-3',
          dir === 'ltr' ? 'text-left' : 'text-right',
          isUnread
            ? 'border-[#d6cbb2] bg-[#efe7d8] hover:bg-[#e8ddc9]'
            : 'border-[#eae5d7] bg-transparent hover:bg-[#f1eadc]',
        )}
        onClick={() => onSelect(item)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className={cn(
                  'text-base leading-6 font-semibold',
                  isUnread ? 'text-[#181927]' : 'text-[#402f28]',
                )}
              >
                {t(item.titleKey)}
              </p>
              <p className="mt-1.5 text-sm leading-5 font-normal text-[#414651]">
                {t(item.bodyKey)}
              </p>
            </div>

            {isUnread ? (
              <span
                aria-hidden="true"
                className="mt-2 block size-2.5 shrink-0 rounded-full bg-[#c99d61]"
              />
            ) : null}
          </div>

          <time
            data-slot={
              isPageItem
                ? 'notifications-page-timestamp'
                : 'dashboard-notification-timestamp'
            }
            dateTime={item.createdAt}
            className="mt-2 block text-xs leading-5 font-medium text-[#876647]"
          >
            {formatDashboardNotificationDateTime(
              item.createdAt,
              i18n.resolvedLanguage,
            )}
          </time>
        </div>

        <div
          aria-hidden="true"
          className={cn(
            'flex size-[57px] shrink-0 items-center justify-center rounded-full border border-[#eae5d7] bg-[#f8f3e8] shadow-[0_1px_2px_rgba(10,13,18,0.05),inset_0_-2px_0_rgba(10,13,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18)]',
            isUnread && 'border-[#bfab85] bg-[#f4eee1]',
          )}
        >
          <img
            src={item.iconSrc}
            alt=""
            className="h-[27px] w-[26px] object-contain"
          />
        </div>
      </button>
    </li>
  )
}
