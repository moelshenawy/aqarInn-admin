import { LogOut, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { useAuth } from '@/features/auth/context/auth-provider'
import { AppButton } from '@/shared/components/app-button'

export function UserMenu() {
  const { t } = useTranslation(['auth', 'permissions'])
  const navigate = useNavigate()
  const { role, signOut, user } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AppButton variant="outline" className="rounded-full px-4">
          <ShieldCheck className="size-4" />
          <span className="max-w-32 truncate">{user?.name ?? 'User'}</span>
        </AppButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl">
        <DropdownMenuLabel className="space-y-1">
          <p className="text-foreground text-sm font-medium">{user?.email}</p>
          <p className="text-muted-foreground text-xs font-normal">
            {t(`permissions:roles.${role}`)}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            signOut()
            navigate(ROUTE_PATHS.login, { replace: true })
          }}
        >
          <LogOut className="size-4" />
          {t('auth:logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
