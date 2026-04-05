import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { navigationItems } from '@/app/navigation/navigation.config'
import { useAuth } from '@/features/auth/context/auth-provider'
import { canAccessRoute } from '@/lib/permissions/helpers'
import { cn } from '@/lib/utils'

export function SidebarNav({ onNavigate }) {
  const { t } = useTranslation(['navigation', 'common'])
  const location = useLocation()
  const { role } = useAuth()
  const items = navigationItems.filter((item) =>
    canAccessRoute(role, item.requiredPermissions),
  )

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon
        const active = location.pathname === item.path

        return (
          <Link
            key={item.key}
            to={item.path}
            onClick={onNavigate}
            className={cn(
              'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{t(item.titleKey)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
