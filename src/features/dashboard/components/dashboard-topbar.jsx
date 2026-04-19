import { useMemo, useState } from 'react'
import { Menu } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  buildInvestmentOpportunityDetailsPath,
  ROUTE_PATHS,
} from '@/app/router/route-paths'
import { DashboardUserMenu } from '@/features/dashboard/components/dashboard-user-menu'
import {
  dashboardActions,
  dashboardSectionIcons,
} from '@/features/dashboard/constants/dashboard-ui'
import { useCitiesQuery } from '@/features/investment-opportunities/hooks/use-cities-query'
import { useOpportunitiesQuery } from '@/features/investment-opportunities/hooks/use-opportunities-query'
import { DashboardNotificationsMenu } from '@/features/notifications/components/dashboard-notifications-menu'
import { useNotifications } from '@/features/notifications/hooks/use-notifications'
import { cn } from '@/lib/utils'
import { useDirection } from '@/lib/i18n/direction-provider'

const OPPORTUNITY_STATUS_OPTIONS = [
  { value: 'draft', labelAr: 'مسودة', labelEn: 'Draft' },
  { value: 'published', labelAr: 'منشورة', labelEn: 'Published' },
  { value: 'funded', labelAr: 'مكتملة التمويل', labelEn: 'Funded' },
  { value: 'exited', labelAr: 'مكتملة', labelEn: 'Exited' },
  { value: 'cancelled', labelAr: 'ملغاة', labelEn: 'Cancelled' },
]

function DashboardUtilityTile({ icon, label, className }) {
  const IconComponent = icon

  return (
    <div
      aria-label={label}
      title={label}
      className={cn(
        'flex items-center justify-center rounded-xl bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text-soft)] shadow-[var(--dashboard-shadow)]',
        className,
      )}
    >
      <IconComponent className="size-[22px] shrink-0 stroke-[1.8]" />
    </div>
  )
}

function formatOpportunityStatus(status, language) {
  const option = OPPORTUNITY_STATUS_OPTIONS.find(
    (item) => item.value === status,
  )
  if (!option) {
    return status
  }

  return language === 'en' ? option.labelEn : option.labelAr
}

function buildOpportunityLocation(opportunity, language) {
  const cityName =
    language === 'en'
      ? opportunity.city?.name_en || opportunity.city?.name_ar
      : opportunity.city?.name_ar || opportunity.city?.name_en

  return [opportunity.neighborhood, cityName].filter(Boolean).join('، ')
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
  opportunitySearchQuery,
  onOpportunitySearchChange,
  opportunityAppliedFilters,
  onOpportunityAppliedFiltersChange,
}) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('notifications')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const { dir } = useDirection()

  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const [internalAppliedFilters, setInternalAppliedFilters] = useState({
    cityId: '',
    status: '',
  })
  const [draftFilters, setDraftFilters] = useState({
    cityId: '',
    status: '',
  })
  const isSearchControlled =
    typeof opportunitySearchQuery === 'string' &&
    typeof onOpportunitySearchChange === 'function'
  const isFiltersControlled =
    typeof onOpportunityAppliedFiltersChange === 'function' &&
    opportunityAppliedFilters &&
    typeof opportunityAppliedFilters === 'object'

  const effectiveSearchQuery = isSearchControlled
    ? opportunitySearchQuery
    : internalSearchQuery
  const effectiveAppliedFilters = isFiltersControlled
    ? {
        cityId: opportunityAppliedFilters.cityId ?? '',
        status: opportunityAppliedFilters.status ?? '',
      }
    : internalAppliedFilters

  const normalizedQuery = effectiveSearchQuery.trim()
  const {
    barNotifications,
    unreadCount,
    hasUnread,
    markNotificationAsRead,
    markAllAsRead,
  } = useNotifications()
  const { data: cities = [] } = useCitiesQuery()

  const BellIcon = dashboardSectionIcons.notification
  const FilterIcon = dashboardSectionIcons.chevron
  const SearchIcon = dashboardSectionIcons.search
  const { data: opportunitiesPayload, isFetching: isSearching } =
    useOpportunitiesQuery(
      1,
      normalizedQuery,
      {
        enabled: searchModalOpen || filterModalOpen,
      },
      effectiveAppliedFilters,
    )
  const opportunities = opportunitiesPayload?.data ?? []

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        value: city.id,
        label: i18n.resolvedLanguage === 'en' ? city.name_en : city.name_ar,
      })),
    [cities, i18n.resolvedLanguage],
  )
  const statusOptions = useMemo(
    () =>
      OPPORTUNITY_STATUS_OPTIONS.map((option) => ({
        value: option.value,
        label: i18n.resolvedLanguage === 'en' ? option.labelEn : option.labelAr,
      })),
    [i18n.resolvedLanguage],
  )

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

  function handleOpenSearchModal() {
    setSearchModalOpen(true)
  }

  function handleOpenFilterModal() {
    setDraftFilters(effectiveAppliedFilters)
    setFilterModalOpen(true)
  }

  function handleApplyFilters() {
    if (isFiltersControlled) {
      onOpportunityAppliedFiltersChange(draftFilters)
    } else {
      setInternalAppliedFilters(draftFilters)
    }
    setFilterModalOpen(false)
  }

  function handleResetFilters() {
    const resetFilters = { cityId: '', status: '' }
    setDraftFilters(resetFilters)
    if (isFiltersControlled) {
      onOpportunityAppliedFiltersChange(resetFilters)
    } else {
      setInternalAppliedFilters(resetFilters)
    }
  }

  function handleCancelFilters() {
    setDraftFilters(effectiveAppliedFilters)
    setFilterModalOpen(false)
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

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={dashboardActions.topbar.searchLabel}
          className="hidden size-9 rounded-lg text-[color:var(--dashboard-text-soft)] hover:bg-transparent lg:flex"
          onClick={handleOpenSearchModal}
        >
          <SearchIcon className="size-[22px] shrink-0 stroke-[1.8]" />
        </Button>
        <div className="hidden h-[18px] w-px bg-[color:var(--dashboard-border)] lg:block" />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={dashboardActions.topbar.settingsLabel}
          className="hidden size-9 rounded-lg text-[color:var(--dashboard-text-soft)] hover:bg-transparent lg:flex"
          onClick={handleOpenFilterModal}
        >
          <FilterIcon className="size-[22px] shrink-0 stroke-[1.8]" />
        </Button>
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

      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className="max-w-[520px] bg-[#f8f3e8]" dir={dir}>
          <DialogHeader className="mb-1 text-start">
            <DialogTitle className="text-lg font-semibold text-[#402f28]">
              {i18n.resolvedLanguage === 'ar'
                ? 'تصفية الفرص'
                : 'Filter opportunities'}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#876647]">
              {i18n.resolvedLanguage === 'ar'
                ? 'اختر المدينة والحالة ثم طبّق الفلاتر.'
                : 'Select city and status, then apply filters.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <label className="block space-y-2 text-start">
              <span className="text-sm font-medium text-[#402f28]">
                {i18n.resolvedLanguage === 'ar' ? 'المدينة' : 'City'}
              </span>
              <select
                value={draftFilters.cityId}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    cityId: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-lg border border-[#d6cbb2] bg-[#fffdf8] px-3 text-sm text-[#402f28] outline-none focus-visible:ring-2 focus-visible:ring-[#9d7e55]/25"
              >
                <option value="">
                  {i18n.resolvedLanguage === 'ar' ? 'كل المدن' : 'All cities'}
                </option>
                {cityOptions.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2 text-start">
              <span className="text-sm font-medium text-[#402f28]">
                {i18n.resolvedLanguage === 'ar' ? 'الحالة' : 'Status'}
              </span>
              <select
                value={draftFilters.status}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-lg border border-[#d6cbb2] bg-[#fffdf8] px-3 text-sm text-[#402f28] outline-none focus-visible:ring-2 focus-visible:ring-[#9d7e55]/25"
              >
                <option value="">
                  {i18n.resolvedLanguage === 'ar'
                    ? 'كل الحالات'
                    : 'All statuses'}
                </option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#d6cbb2] bg-transparent text-[#5c4437] hover:bg-[#efe7d7]"
              onClick={handleCancelFilters}
            >
              {i18n.resolvedLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-[#d6cbb2] bg-transparent text-[#5c4437] hover:bg-[#efe7d7]"
              onClick={handleResetFilters}
            >
              {i18n.resolvedLanguage === 'ar' ? 'إعادة تعيين' : 'Reset'}
            </Button>
            <Button
              type="button"
              className="bg-[#402f28] text-white hover:bg-[#4a3730]"
              onClick={handleApplyFilters}
            >
              {i18n.resolvedLanguage === 'ar' ? 'تطبيق' : 'Apply'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
        <DialogContent className="max-w-[760px] bg-[#f8f3e8]" dir={dir}>
          <DialogHeader className="mb-1 text-start">
            <DialogTitle className="text-lg font-semibold text-[#402f28]">
              {i18n.resolvedLanguage === 'ar'
                ? 'البحث في الفرص'
                : 'Search opportunities'}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#876647]">
              {i18n.resolvedLanguage === 'ar'
                ? 'ابحث باستخدام المعرّف أو العنوان أو الموقع أو الحالة.'
                : 'Search by ID, title, location, or status.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <input
              type="text"
              value={effectiveSearchQuery}
              onChange={(event) => {
                if (isSearchControlled) {
                  onOpportunitySearchChange(event.target.value)
                } else {
                  setInternalSearchQuery(event.target.value)
                }
              }}
              placeholder={
                i18n.resolvedLanguage === 'ar'
                  ? 'ابحث عن فرصة استثمارية'
                  : 'Search opportunities'
              }
              className="h-11 w-full rounded-lg border border-[#d6cbb2] bg-[#fffdf8] px-3 text-sm text-[#402f28] outline-none placeholder:text-[#9d7e55] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/25"
            />

            <div className="max-h-[420px] space-y-2 overflow-y-auto">
              {isSearching ? (
                <p className="rounded-lg border border-[#eae5d7] bg-[#fffdf8] px-3 py-4 text-start text-sm text-[#876647]">
                  {i18n.resolvedLanguage === 'ar'
                    ? 'جارٍ البحث...'
                    : 'Searching...'}
                </p>
              ) : opportunities.length ? (
                opportunities.map((opportunity) => {
                  const title = opportunity.title
                  const detailsPath = buildInvestmentOpportunityDetailsPath(
                    opportunity.id,
                    i18n.resolvedLanguage,
                  )

                  return (
                    <article
                      key={opportunity.id}
                      className="rounded-xl border border-[#e4dac7] bg-[#fffdf8] p-3 shadow-[0_2px_8px_rgba(64,47,40,0.08)]"
                    >
                      <Link
                        to={detailsPath}
                        className="block space-y-1.5 text-start"
                      >
                        <p className="line-clamp-2 text-sm leading-6 font-semibold text-[#181927] hover:text-[#6d4f3b]">
                          {title}
                        </p>
                        <p className="text-xs text-[#876647]">
                          {i18n.resolvedLanguage === 'ar' ? 'المعرّف:' : 'ID:'}{' '}
                          {opportunity.reference_code || opportunity.id}
                        </p>
                        <p className="text-xs text-[#876647]">
                          {i18n.resolvedLanguage === 'ar'
                            ? 'الموقع:'
                            : 'Location:'}{' '}
                          {buildOpportunityLocation(
                            opportunity,
                            i18n.resolvedLanguage,
                          ) ||
                            (i18n.resolvedLanguage === 'ar'
                              ? 'غير متوفر'
                              : 'Not available')}
                        </p>
                        <p className="text-xs text-[#876647]">
                          {i18n.resolvedLanguage === 'ar'
                            ? 'الحالة:'
                            : 'Status:'}{' '}
                          {formatOpportunityStatus(
                            opportunity.status,
                            i18n.resolvedLanguage,
                          )}
                        </p>
                      </Link>
                    </article>
                  )
                })
              ) : (
                <p className="rounded-lg border border-[#eae5d7] bg-[#fffdf8] px-3 py-4 text-start text-sm text-[#876647]">
                  {i18n.resolvedLanguage === 'ar'
                    ? 'لا توجد نتائج مطابقة.'
                    : 'No matching opportunities.'}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
