import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { DashboardUserMenu } from '@/features/dashboard/components/dashboard-user-menu'
import {
  dashboardActions,
  dashboardSectionIcons,
} from '@/features/dashboard/constants/dashboard-ui'
import { DashboardNotificationsMenu } from '@/features/notifications/components/dashboard-notifications-menu'
import { useNotifications } from '@/features/notifications/hooks/use-notifications'
import { cn } from '@/lib/utils'

function DashboardUtilityTile({ icon: Icon, label, className }) {
  return (
    <div
      aria-label={label}
      title={label}
      className={cn(
        'flex items-center justify-center rounded-xl bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text-soft)] shadow-[var(--dashboard-shadow)]',
        className,
      )}
    >
      <Icon className="size-[22px] shrink-0 stroke-[1.8]" />
    </div>
  )
}

export function DashboardMobileSidebarUtilities({ user, onNavigate }) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('notifications')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const {
    barNotifications,
    unreadCount,
    hasUnread,
    markNotificationAsRead,
    markAllAsRead,
  } = useNotifications()

  const BellIcon = dashboardSectionIcons.notification
  const SettingsIcon = dashboardSectionIcons.chevron
  const SearchIcon = dashboardSectionIcons.search

  function handleNotificationSelect(notification) {
    markNotificationAsRead(notification.id)
    setNotificationsOpen(false)

    if (
      typeof notification.targetPath === 'string' &&
      notification.targetPath.startsWith('/')
    ) {
      navigate(
        ROUTE_PATHS.withLocale(notification.targetPath, i18n.resolvedLanguage),
      )
    } else {
      navigate(notification.targetPath)
    }

    onNavigate?.()
  }

  function handleViewAllNotifications() {
    setNotificationsOpen(false)
    navigate(
      ROUTE_PATHS.withLocale(ROUTE_PATHS.notifications, i18n.resolvedLanguage),
    )
    onNavigate?.()
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <DashboardUtilityTile
          icon={SearchIcon}
          label={dashboardActions.topbar.searchLabel}
          className="h-[61px]"
        />

        <DashboardUtilityTile
          icon={SettingsIcon}
          label={dashboardActions.topbar.settingsLabel}
          className="h-[61px]"
        />

        <DashboardNotificationsMenu
          bellIcon={BellIcon}
          items={barNotifications}
          unreadCount={unreadCount}
          hasUnread={hasUnread}
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
          onNotificationSelect={handleNotificationSelect}
          onMarkAllAsRead={markAllAsRead}
          onViewAll={handleViewAllNotifications}
          triggerLabel={t('notificationsBar.triggerLabel')}
          markAllLabel={t('notificationsBar.actions.markAllAsRead')}
          viewAllLabel={t('notificationsBar.actions.viewAllNotifications')}
          triggerClassName="h-[61px] min-w-0 w-full px-0"
          contentClassName="w-[calc(100vw-48px)] max-w-[420px] sm:w-[420px]"
          align="end"
        />
      </div>

      <DashboardUserMenu
        user={user}
        triggerClassName="w-full min-w-0"
        contentClassName="w-[calc(100vw-48px)] max-w-[320px] sm:w-[320px]"
      />
    </div>
  )
}

export function DashboardTopbar({ title, user, onOpenSidebar }) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('notifications')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const {
    barNotifications,
    unreadCount,
    hasUnread,
    markNotificationAsRead,
    markAllAsRead,
  } = useNotifications()

  const BellIcon = dashboardSectionIcons.notification
  const SettingsIcon = dashboardSectionIcons.chevron
  const SearchIcon = dashboardSectionIcons.search

  function handleNotificationSelect(notification) {
    markNotificationAsRead(notification.id)
    setNotificationsOpen(false)

    if (
      typeof notification.targetPath === 'string' &&
      notification.targetPath.startsWith('/')
    ) {
      navigate(
        ROUTE_PATHS.withLocale(notification.targetPath, i18n.resolvedLanguage),
      )
    } else {
      navigate(notification.targetPath)
    }
  }

  function handleViewAllNotifications() {
    setNotificationsOpen(false)
    navigate(
      ROUTE_PATHS.withLocale(ROUTE_PATHS.notifications, i18n.resolvedLanguage),
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
      <div className="flex h-[69px] min-w-0 flex-1 items-center justify-end gap-3 rounded-xl bg-[color:var(--dashboard-surface)] px-4 py-[13px] shadow-[var(--dashboard-shadow)]">
        <p className="min-w-0 flex-1 truncate text-right text-lg leading-7 font-semibold text-[color:var(--dashboard-text)]">
          {title}
        </p>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="فتح القائمة الجانبية"
          className="size-9 rounded-lg text-[color:var(--dashboard-text-soft)] hover:bg-transparent lg:hidden"
          onClick={onOpenSidebar}
        >
          <Menu className="size-5" />
          <span className="sr-only">فتح القائمة</span>
        </Button>

        <SearchIcon className="hidden size-[22px] shrink-0 stroke-[1.8] text-[color:var(--dashboard-text-soft)] lg:block" />
        <div className="hidden h-[18px] w-px bg-[color:var(--dashboard-border)] lg:block" />
        <SettingsIcon className="hidden size-[22px] shrink-0 stroke-[1.8] text-[color:var(--dashboard-text-soft)] lg:block" />
      </div>

      <div className="hidden lg:block">
        <DashboardUserMenu user={user} />
      </div>

      <div className="hidden lg:block">
        <DashboardNotificationsMenu
          bellIcon={BellIcon}
          items={barNotifications}
          unreadCount={unreadCount}
          hasUnread={hasUnread}
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
          onNotificationSelect={handleNotificationSelect}
          onMarkAllAsRead={markAllAsRead}
          onViewAll={handleViewAllNotifications}
          triggerLabel={t('notificationsBar.triggerLabel')}
          markAllLabel={t('notificationsBar.actions.markAllAsRead')}
          viewAllLabel={t('notificationsBar.actions.viewAllNotifications')}
        />
      </div>
    </div>
  )
}
