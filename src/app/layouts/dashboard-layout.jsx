import { useMemo, useState } from 'react'
import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, Outlet, useMatches } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { useAuth } from '@/features/auth/context/auth-provider'
import { useDirection } from '@/lib/i18n/direction-provider'
import { canAccessRoute } from '@/lib/permissions/helpers'
import { AppBreadcrumbs } from '@/shared/components/app-breadcrumbs'
import { LanguageSwitcher } from '@/shared/components/language-switcher'
import { SidebarNav } from '@/shared/components/sidebar-nav'
import { UserMenu } from '@/shared/components/user-menu'

export function DashboardLayout() {
  const { t } = useTranslation('common')
  const matches = useMatches()
  const { dir } = useDirection()
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
    <div className="flex h-full flex-col">
      <div className="border-border/70 border-b px-5 py-6">
        <Link to={ROUTE_PATHS.dashboard} className="block">
          <p className="text-foreground text-lg font-semibold tracking-tight">
            {t('appName')}
          </p>
          <p className="text-muted-foreground text-sm">
            {t('backofficeLabel')}
          </p>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav onNavigate={() => setSidebarOpen(false)} />
      </div>
    </div>
  )

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="border-border/70 bg-background sticky top-0 hidden h-screen w-72 border-e lg:block">
          {sidebar}
        </aside>
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="border-border/70 bg-background/95 sticky top-0 z-20 border-b backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="size-4" />
                  <span className="sr-only">{t('openNavigation')}</span>
                </Button>
                <div className="min-w-0 space-y-1">
                  <AppBreadcrumbs />
                  <p className="text-muted-foreground truncate text-sm">
                    {activeRoute?.handle?.descriptionKey
                      ? t(activeRoute.handle.descriptionKey)
                      : t('shellReady')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <LanguageSwitcher />
                <UserMenu />
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 sm:px-6 xl:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side={dir === 'rtl' ? 'right' : 'left'}
          className="border-border/70 bg-background w-full max-w-xs border-s p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{t('navigation')}</SheetTitle>
          </SheetHeader>
          {sidebar}
        </SheetContent>
      </Sheet>
    </div>
  )
}
