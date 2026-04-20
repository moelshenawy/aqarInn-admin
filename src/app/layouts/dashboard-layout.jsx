import { useMemo, useState } from 'react'
import {
  Navigate,
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
} from 'react-router-dom'
import { Languages, XIcon } from 'lucide-react'
import { LocalizedLink } from '@/shared/components/localized-link'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { DashboardSidebarItem } from '@/features/dashboard/components/dashboard-sidebar-item'
import { DashboardTopbar } from '@/features/dashboard/components/dashboard-topbar'
import { DashboardUserMenu } from '@/features/dashboard/components/dashboard-user-menu'
import {
  dashboardActions,
  dashboardNavItems,
  dashboardRouteTitles,
  dashboardTopbarUser,
} from '@/features/dashboard/constants/dashboard-ui'
import {
  getInitialDashboardSidebarCollapsed,
  persistDashboardSidebarCollapsed,
} from '@/features/dashboard/constants/dashboard-storage'
import { NotificationsProvider } from '@/features/notifications/context/notifications-provider'
import { useAuth } from '@/features/auth/context/auth-provider'
import { useSyncLocaleWithPath } from '@/lib/i18n/use-sync-locale-with-path'
import { stripLocalePrefix } from '@/lib/i18n/language'
import { useAuthorization } from '@/lib/permissions/use-authorization'
import { cn } from '@/lib/utils'

const logoMark = '/assets/dashboard/logo-mark.svg'

function DashboardBrand({
  collapsed = false,
  canCollapse = false,
  onToggleCollapse,
  mobileClose = false,
}) {
  const isExpanded = !collapsed

  return (
    <div
      className={cn(
        'flex items-center transition-[gap,justify-content] duration-300 ease-in-out',
        collapsed ? 'justify-center gap-3' : 'justify-between',
      )}
    >
      <LocalizedLink
        to={ROUTE_PATHS.dashboard}
        aria-label="عقار إن"
        className={cn(
          'flex h-[41px] shrink-0 items-center overflow-hidden transition-[width] duration-300 ease-in-out',
          isExpanded ? 'w-[109px] justify-start' : 'w-[33px] justify-center',
        )}
      >
        <img
          src={isExpanded ? '/assets/Logo.svg' : logoMark}
          alt="عقار إن"
          className={cn(
            'h-[41px] max-w-none transition-[width] duration-300 ease-in-out',
            isExpanded ? 'w-auto' : 'w-[33px]',
          )}
        />
      </LocalizedLink>

      {canCollapse ? (
        <button
          type="button"
          aria-label={
            collapsed
              ? 'توسيع القائمة الجانبية'
              : 'طي القائمة الجانبية'
          }
          className="flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[color:var(--dashboard-bg)] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/20 focus-visible:outline-none"
          onClick={onToggleCollapse}
        >
          <img
            src="/assets/icons/window.svg"
            alt=""
            className="size-5"
            aria-hidden="true"
          />
        </button>
      ) : mobileClose ? (
        <SheetClose data-slot="sheet-close" asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="إغلاق القائمة"
            className="size-7 rounded-[min(var(--radius-md),12px)]"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </Button>
        </SheetClose>
      ) : (
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center"
        >
          <img src="/assets/icons/window.svg" alt="" className="size-5" />
        </span>
      )}
    </div>
  )
}

function DashboardSidebar({
  pathname,
  search,
  hash,
  onNavigate,
  collapsed = false,
  canCollapse = false,
  onToggleCollapse,
  locale,
  mobileClose = false,
  user = null,
  canAccessRoute,
}) {
  const navigate = useNavigate()
  const basePath = stripLocalePrefix(pathname)
  const nextLocale = locale === 'en' ? 'ar' : 'en'
  const localeToggleLabel = locale === 'en' ? 'العربية' : 'English'
  const localeTooltipLabel =
    locale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'

  const handleToggleLocale = () => {
    const nextPath = ROUTE_PATHS.withLocale(basePath, nextLocale)
    navigate(`${nextPath}${search}${hash}`, { replace: true })
    onNavigate?.()
  }

  const visibleNavItems = dashboardNavItems.filter((item) =>
    canAccessRoute ? canAccessRoute(item.requiredPermissions ?? []) : true,
  )

  return (
    <div
      data-slot="dashboard-sidebar"
      data-sidebar-context={canCollapse ? 'desktop' : 'mobile'}
      data-sidebar-state={collapsed ? 'collapsed' : 'expanded'}
      className={cn(
        'flex h-full flex-col rounded-[10px] bg-[color:var(--dashboard-surface)] py-6 shadow-[var(--dashboard-shadow)] transition-[padding] duration-300 ease-in-out',
        collapsed ? 'px-3' : 'px-5',
      )}
    >
      <DashboardBrand
        collapsed={collapsed}
        canCollapse={canCollapse}
        onToggleCollapse={onToggleCollapse}
        mobileClose={mobileClose}
      />

      <div
        className={cn(
          'flex-1 space-y-5 transition-[margin] duration-300 ease-in-out',
          collapsed ? 'mt-10' : 'mt-16',
        )}
      >
        {visibleNavItems.map((item) => {
          const localizedBase = ROUTE_PATHS.withLocale(item.path, locale)
          const isActive =
            pathname === localizedBase ||
            pathname.startsWith(`${localizedBase}/`)
          const sidebarLabel =
            locale === 'en' ? (item.labelEn ?? item.label) : item.label

          return (
            <DashboardSidebarItem
              key={item.key}
              icon={item.icon}
              label={sidebarLabel}
              to={localizedBase}
              active={isActive}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          )
        })}
      </div>

      {mobileClose && user ? (
        <div className="space-y-3 border-t border-[color:var(--dashboard-border)] pt-6">
          <DashboardUserMenu
            user={user}
            triggerClassName="w-full min-w-0"
            contentClassName="w-[calc(100vw-48px)] max-w-[320px] sm:w-[320px]"
          />
          <DashboardSidebarItem
            icon={Languages}
            label={collapsed ? localeTooltipLabel : localeToggleLabel}
            onClick={handleToggleLocale}
            collapsed={collapsed}
          />
        </div>
      ) : (
        <div className="space-y-3 border-t border-[color:var(--dashboard-border)] pt-6">
          <DashboardSidebarItem
            icon={Languages}
            label={collapsed ? localeTooltipLabel : localeToggleLabel}
            onClick={handleToggleLocale}
            collapsed={collapsed}
          />
        </div>
      )}
    </div>
  )
}

export function DashboardLayout() {
  const matches = useMatches()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { canAccessRoute } = useAuthorization()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [opportunitySearchQuery, setOpportunitySearchQuery] = useState('')
  const [opportunityAppliedFilters, setOpportunityAppliedFilters] = useState({
    cityId: '',
    status: '',
  })
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    getInitialDashboardSidebarCollapsed,
  )
  const localeFromPath = useSyncLocaleWithPath()

  const activeRoute = useMemo(
    () => [...matches].reverse().find((match) => match.handle?.key),
    [matches],
  )

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTE_PATHS.withLocale(ROUTE_PATHS.login, localeFromPath)}
        replace
      />
    )
  }

  if (
    activeRoute?.handle &&
    !canAccessRoute(activeRoute.handle.requiredPermissions ?? [])
  ) {
    return (
      <Navigate
        to={ROUTE_PATHS.withLocale(
          ROUTE_PATHS.unauthorized,
          localeFromPath,
        )}
        replace
      />
    )
  }

  const activeRouteKey = activeRoute?.handle?.key
  const pageTitle =
    dashboardRouteTitles[activeRouteKey] ?? dashboardRouteTitles.dashboard

  const handleToggleDesktopSidebar = () => {
    setIsSidebarCollapsed((current) => {
      const next = !current
      persistDashboardSidebarCollapsed(next)
      return next
    })
  }

  const desktopSidebar = (
    <DashboardSidebar
      pathname={location.pathname}
      search={location.search}
      hash={location.hash}
      collapsed={isSidebarCollapsed}
      canCollapse
      onToggleCollapse={handleToggleDesktopSidebar}
      onNavigate={() => setSidebarOpen(false)}
      locale={localeFromPath}
      canAccessRoute={canAccessRoute}
    />
  )

  const mobileSidebar = (
    <DashboardSidebar
      pathname={location.pathname}
      search={location.search}
      hash={location.hash}
      onNavigate={() => setSidebarOpen(false)}
      locale={localeFromPath}
      mobileClose
      user={dashboardTopbarUser}
      canAccessRoute={canAccessRoute}
    />
  )

  return (
    <NotificationsProvider>
      <div className="min-h-screen bg-[color:var(--dashboard-bg)] p-4 sm:p-5">
        <div
          className={cn(
            'mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1440px] grid-cols-1 gap-5 transition-[grid-template-columns] duration-300 ease-in-out',
            isSidebarCollapsed
              ? 'lg:grid-cols-[96px_minmax(0,1fr)]'
              : 'lg:grid-cols-[266px_minmax(0,1fr)]',
          )}
        >
          <aside className="hidden h-[calc(100vh-2.5rem)] min-h-[992px] lg:block">
            {desktopSidebar}
          </aside>

          <main className="min-w-0">
            <DashboardTopbar
              title={pageTitle}
              pageTitleKey={activeRouteKey}
              user={dashboardTopbarUser}
              onOpenSidebar={() => setSidebarOpen(true)}
              opportunitySearchQuery={opportunitySearchQuery}
              onOpportunitySearchChange={setOpportunitySearchQuery}
              opportunityAppliedFilters={opportunityAppliedFilters}
              onOpportunityAppliedFiltersChange={setOpportunityAppliedFilters}
            />
            <div className="pt-[31px]">
              <Outlet
                context={{
                  opportunitySearchQuery,
                  opportunityAppliedFilters,
                }}
              />
            </div>
          </main>
        </div>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="right"
            showCloseButton={false}
            className="w-full max-w-[290px] border-none bg-[color:var(--dashboard-bg)] p-4"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>{dashboardActions.topbar.settingsLabel}</SheetTitle>
            </SheetHeader>
            {mobileSidebar}
          </SheetContent>
        </Sheet>
      </div>
    </NotificationsProvider>
  )
}
