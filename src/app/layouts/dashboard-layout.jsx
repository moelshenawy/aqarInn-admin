import { useMemo, useState } from 'react'
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useMatches,
} from 'react-router-dom'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { DashboardSidebarItem } from '@/features/dashboard/components/dashboard-sidebar-item'
import { DashboardTopbar } from '@/features/dashboard/components/dashboard-topbar'
import {
  dashboardActions,
  dashboardNavItems,
  dashboardSettingsItem,
  dashboardTopbar,
} from '@/features/dashboard/constants/dashboard-ui'
import { useAuth } from '@/features/auth/context/auth-provider'
import { canAccessRoute } from '@/lib/permissions/helpers'

function DashboardBrand() {
  return (
    <Link
      to={ROUTE_PATHS.dashboard}
      className="flex items-center justify-between"
    >
      <div className="relative h-[41px] w-[109px]">
        <img
          src={'/assets/Logo.svg'}
          alt="عقار إن"
          className="absolute top-0 left-0 h-[41px] w-auto"
        />
      </div>

      <div className="size-8">
        <img
          src={'/assets/icons/window.svg'}
          alt="عقار إن"
          className="h-[41px] w-auto"
        />
      </div>
    </Link>
  )
}

function DashboardSidebar({ pathname, onNavigate }) {
  return (
    <div className="flex h-full flex-col rounded-[10px] bg-[color:var(--dashboard-surface)] px-5 py-6 shadow-[var(--dashboard-shadow)]">
      <DashboardBrand />
      <div className="mt-16 flex-1 space-y-5">
        {dashboardNavItems.map((item) => (
          <DashboardSidebarItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            to={item.path}
            active={pathname === item.path}
            onNavigate={onNavigate}
          />
        ))}
      </div>
      <DashboardSidebarItem
        icon={dashboardSettingsItem.icon}
        label={dashboardSettingsItem.label}
        disabled
      />
    </div>
  )
}

export function DashboardLayout() {
  const matches = useMatches()
  const location = useLocation()
  const { role } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeRoute = useMemo(
    () => [...matches].reverse().find((match) => match.handle?.key),
    [matches],
  )

  if (
    activeRoute?.handle &&
    !canAccessRoute(role, activeRoute.handle.requiredPermissions)
  ) {
    return <Navigate to={ROUTE_PATHS.unauthorized} replace />
  }

  const sidebar = (
    <DashboardSidebar
      pathname={location.pathname}
      onNavigate={() => setSidebarOpen(false)}
    />
  )

  return (
    <div className="min-h-screen bg-[color:var(--dashboard-bg)] p-4 sm:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1440px] grid-cols-1 gap-5 lg:grid-cols-[266px_minmax(0,1fr)]">
        <aside className="hidden h-[calc(100vh-2.5rem)] min-h-[992px] lg:block">
          {sidebar}
        </aside>

        <main className="min-w-0">
          <DashboardTopbar
            title={dashboardTopbar.title}
            user={dashboardTopbar.user}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          <div className="pt-[31px]">
            <Outlet />
          </div>
        </main>
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-[290px] border-none bg-[color:var(--dashboard-bg)] p-4"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{dashboardActions.topbar.settingsLabel}</SheetTitle>
          </SheetHeader>
          {sidebar}
        </SheetContent>
      </Sheet>
    </div>
  )
}
