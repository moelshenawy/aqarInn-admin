import { ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/context/auth-provider'
import { APP_ROLES } from '@/lib/permissions/constants'
import { AppButton } from '@/shared/components/app-button'

export function UserMenu() {
  const { t } = useTranslation(['permissions'])
  const { role, setPreviewRole, user } = useAuth()
  const roles = Object.values(APP_ROLES)

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
        {roles.map((roleOption) => (
          <DropdownMenuItem
            key={roleOption}
            className="cursor-pointer"
            onClick={() => setPreviewRole(roleOption)}
          >
            {t(`permissions:roles.${roleOption}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
