import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  buildInvestmentOpportunityDetailsPath,
  ROUTE_PATHS,
} from '@/app/router/route-paths'
import { DashboardUserMenu } from '@/features/dashboard/components/dashboard-user-menu'
import {
  dashboardActions,
  dashboardSectionIcons,
} from '@/features/dashboard/constants/dashboard-ui'
import { useOpportunitiesQuery } from '@/features/investment-opportunities/hooks/use-opportunities-query'
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

export function DashboardTopbar({
  title,
  user,
  onOpenSidebar,
  opportunitySearchQuery = '',
  onOpportunitySearchChange,
}) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('notifications')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)
  const normalizedQuery = opportunitySearchQuery.trim()
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
  const { data: opportunitiesPayload, isFetching: isSearching } =
    useOpportunitiesQuery(1, normalizedQuery, {
      enabled: searchOpen && normalizedQuery.length > 0,
    })
  const opportunities = opportunitiesPayload?.data ?? []

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus()
    }
  }, [searchOpen])

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

  function handleToggleSearch() {
    if (searchOpen) {
      setSearchOpen(false)
      onOpportunitySearchChange?.('')
      return
    }

    setSearchOpen(true)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
      <div className="flex h-[69px] min-w-0 flex-1 items-center justify-end gap-3 rounded-xl bg-[color:var(--dashboard-surface)] px-4 py-[13px] shadow-[var(--dashboard-shadow)]">
        <p className="min-w-0 flex-1 truncate text-start text-lg leading-7 font-semibold text-[color:var(--dashboard-text)]">
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

        <div
          className={cn(
            'relative hidden items-center overflow-visible rounded-lg border border-[#d6cbb2] bg-[#f8f3e8] transition-all duration-300 ease-in-out lg:flex',
            searchOpen
              ? 'w-[280px] px-2.5 py-1.5 opacity-100'
              : 'w-0 border-transparent px-0 py-0 opacity-0',
          )}
        >
          <input
            ref={searchInputRef}
            type="text"
            value={opportunitySearchQuery}
            onChange={(event) =>
              onOpportunitySearchChange?.(event.target.value)
            }
            placeholder={
              i18n.resolvedLanguage === 'ar'
                ? 'ابحث عن فرصة استثمارية'
                : 'Search opportunities'
            }
            className="w-full bg-transparent text-sm leading-5 text-[#402f28] outline-none placeholder:text-[#9d7e55]"
          />

          {searchOpen && normalizedQuery ? (
            <div className="absolute top-[calc(100%+8px)] right-0 z-30 w-[420px] rounded-xl border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] p-3 shadow-[var(--dashboard-shadow)]">
              <p className="px-1 pb-2 text-start text-xs font-medium text-[color:var(--dashboard-text-soft)]">
                {i18n.resolvedLanguage === 'ar'
                  ? 'نتائج الفرص الاستثمارية'
                  : 'Investment opportunities'}
              </p>

              <div className="max-h-[360px] space-y-2 overflow-y-auto">
                {isSearching ? (
                  <p className="rounded-lg bg-[color:var(--dashboard-bg)] px-3 py-4 text-start text-sm text-[color:var(--dashboard-text-soft)]">
                    {i18n.resolvedLanguage === 'ar'
                      ? 'جارٍ البحث...'
                      : 'Searching...'}
                  </p>
                ) : opportunities.length ? (
                  opportunities.map((opportunity) => {
                    const title =
                      i18n.resolvedLanguage === 'en'
                        ? opportunity.title_en || opportunity.title_ar
                        : opportunity.title_ar || opportunity.title_en
                    const detailsPath = buildInvestmentOpportunityDetailsPath(
                      opportunity.id,
                      i18n.resolvedLanguage,
                    )

                    return (
                      <article
                        key={opportunity.id}
                        className="rounded-xl border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-bg)] p-2"
                      >
                        <Link
                          to={detailsPath}
                          className="block overflow-hidden rounded-lg"
                        >
                          <img
                            src={
                              opportunity.cover_image_url ||
                              'https://placehold.co/358x131'
                            }
                            alt={title}
                            className="h-[92px] w-full object-cover"
                          />
                        </Link>
                        <Link
                          to={detailsPath}
                          className="mt-2 line-clamp-2 block text-start text-sm leading-6 font-semibold text-[#181927] hover:text-[#6d4f3b]"
                        >
                          {title}
                        </Link>
                      </article>
                    )
                  })
                ) : (
                  <p className="rounded-lg bg-[color:var(--dashboard-bg)] px-3 py-4 text-start text-sm text-[color:var(--dashboard-text-soft)]">
                    {i18n.resolvedLanguage === 'ar'
                      ? 'لا توجد نتائج مطابقة.'
                      : 'No matching opportunities.'}
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={dashboardActions.topbar.searchLabel}
          className="hidden size-9 rounded-lg text-[color:var(--dashboard-text-soft)] hover:bg-transparent lg:flex"
          onClick={handleToggleSearch}
        >
          <SearchIcon className="size-[22px] shrink-0 stroke-[1.8]" />
        </Button>
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
