import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDashboardNotificationDateTime } from '@/features/notifications/constants/dashboard-notifications'
import { useDirection } from '@/lib/i18n/direction-provider'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

function NotificationMenuItem({ item, dir, onSelect }) {
  const { t, i18n } = useTranslation('notifications')
  const isUnread = !item.isRead

  return (
    <li>
      <button
        type="button"
        data-slot="dashboard-notification-item"
        data-notification-id={item.id}
        data-state={isUnread ? 'unread' : 'read'}
        className={cn(
          'flex w-full items-start gap-4 rounded-[14px] border p-3 text-inherit transition-colors focus-visible:ring-2 focus-visible:ring-[#9d7e55]/20 focus-visible:outline-none',
          dir === 'ltr' ? 'text-left' : 'text-right',
          isUnread
            ? 'border-[#d6cbb2] bg-[#efe7d8] hover:bg-[#e8ddc9]'
            : 'border-[#eae5d7] bg-transparent hover:bg-[#f1eadc]',
        )}
        onClick={() => onSelect(item)}
      >
        <div className="min-w-0 flex-1">
          <div
            className={cn('flex flex-row items-start justify-between gap-3')}
          >
            <div className="min-w-0">
              <p
                className={cn(
                  'text-base leading-6 font-semibold',
                  isUnread ? 'text-[#181927]' : 'text-[#402f28]',
                )}
              >
                {t(item.titleKey)}
              </p>
            </div>

            {isUnread ? (
              <span
                aria-hidden="true"
                className="mt-2 block size-2.5 shrink-0 rounded-full bg-[#c99d61]"
              />
            ) : null}
          </div>

          <p className="mt-1.5 text-sm leading-5 font-normal text-[#414651]">
            {t(item.bodyKey)}
          </p>
          <time
            data-slot="dashboard-notification-timestamp"
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

export function DashboardNotificationsMenu({
  bellIcon,
  items,
  unreadCount,
  hasUnread,
  open,
  onOpenChange,
  onNotificationSelect,
  onMarkAllAsRead,
  onViewAll,
  triggerLabel,
  markAllLabel,
  viewAllLabel,
}) {
  const BellIconComponent = bellIcon
  const { t } = useTranslation('notifications')
  const { dir } = useDirection()

  return (
    <DropdownMenu
      dir="ltr"
      modal={false}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={triggerLabel}
          className={cn(
            'relative flex h-[69px] min-w-[61px] items-center justify-center rounded-xl px-4 shadow-[var(--dashboard-shadow)] transition-colors focus-visible:ring-2 focus-visible:ring-[#9d7e55]/20 focus-visible:outline-none',
            open
              ? 'bg-[color:var(--dashboard-surface-strong)] text-[#f8f3e8]'
              : 'bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text-soft)] hover:bg-[#ded6c4]',
          )}
        >
          <BellIconComponent className="size-[22px] stroke-[1.8]" />
          {hasUnread ? (
            <span
              data-slot="dashboard-notifications-trigger-indicator"
              className="absolute top-[16px] left-[22px] block size-[11px] rounded-full bg-[#c99d61]"
            />
          ) : null}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={12}
        collisionPadding={16}
        className="w-[calc(100vw-32px)] max-w-[503px] rounded-[12px] border border-[#d6cbb2] bg-[#f8f3e8] p-0 text-[#6d4f3b] shadow-[0_12px_32px_rgba(64,47,40,0.14)] ring-0 sm:w-[503px] [&::-webkit-scrollbar]:hidden"
      >
        <div
          data-slot="dashboard-notifications-content"
          dir={dir}
          className="max-h-[calc(100vh-32px)] overflow-y-auto px-[26px] py-6 sm:max-h-[919px]"
        >
          <div className="flex flex-col gap-6">
            <div
              className={cn(
                'flex items-center gap-3',
                dir === 'ltr'
                  ? 'flex-row justify-between'
                  : 'flex-row-reverse justify-between',
              )}
            >
              <p
                className={cn(
                  'text-lg leading-7 font-semibold text-[color:var(--dashboard-text)]',
                  dir === 'ltr' ? 'text-left' : 'text-right',
                )}
              >
                {t('notificationsBar.title')}
              </p>
              <span
                data-slot="dashboard-notifications-unread-count"
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

            <ul aria-live="polite" className="space-y-3">
              {items.map((item) => (
                <NotificationMenuItem
                  key={item.id}
                  item={item}
                  dir={'rtl'}
                  onSelect={onNotificationSelect}
                />
              ))}
            </ul>

            <div className="border-t border-[#d6cbb2] pt-4">
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={!hasUnread}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#402f28] px-4 text-sm leading-5 font-semibold text-white shadow-[var(--dashboard-shadow)] transition hover:bg-[#4c382f] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[#c8bca8] disabled:text-white/70"
                  onClick={onMarkAllAsRead}
                >
                  {markAllLabel}
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-[#d6cbb2] bg-white px-4 text-sm leading-5 font-semibold text-[#402f28] shadow-[var(--dashboard-shadow)] transition hover:bg-[#f1eadc] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
                  onClick={onViewAll}
                >
                  {viewAllLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
