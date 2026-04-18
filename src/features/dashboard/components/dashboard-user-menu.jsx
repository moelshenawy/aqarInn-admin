import { ChevronDown, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  showDashboardErrorToast,
  showDashboardLoadingToast,
  showDashboardSuccessToast,
} from '@/components/ui/dashboard-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/context/auth-provider'
import * as authService from '@/features/auth/services/auth-service'
import { useDirection } from '@/lib/i18n/direction-provider'
import { cn } from '@/lib/utils'
import { ConfirmationDialog } from '@/shared/components/confirmation-dialog'

function getDisplayName(currentUser, fallbackUser, language) {
  if (language === 'ar') {
    return (
      currentUser?.full_name_ar ??
      currentUser?.name ??
      currentUser?.full_name_en ??
      fallbackUser?.name ??
      currentUser?.email ??
      ''
    )
  }

  return (
    currentUser?.full_name_en ??
    currentUser?.name ??
    currentUser?.full_name_ar ??
    fallbackUser?.name ??
    currentUser?.email ??
    ''
  )
}

export function DashboardUserMenu({
  user,
  triggerClassName,
  contentClassName,
  contentAlign = 'end',
}) {
  const navigate = useNavigate()
  const { dir } = useDirection()
  const { t, i18n } = useTranslation(['auth', 'permissions', 'common'])
  const { user: currentUser, role, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const displayName = getDisplayName(
    currentUser,
    user,
    i18n.resolvedLanguage ?? 'ar',
  )
  const displayEmail = currentUser?.email ?? user?.email ?? ''
  const displayAvatar = user?.avatar
  const translatedRole = t(`permissions:roles.${role}`)
  const displayRole =
    translatedRole === `permissions:roles.${role}`
      ? (user?.role ?? '')
      : translatedRole

  function handleRequestLogout() {
    setOpen(false)
    setLogoutDialogOpen(true)
  }

  function handleConfirmLogout() {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)
    setLogoutDialogOpen(false)

    const accessToken = window.localStorage.getItem('authToken')
    const loadingToastId = showDashboardLoadingToast({
      title: t('auth:loggingOut'),
    })

    logout()
    navigate(ROUTE_PATHS.withLocale(ROUTE_PATHS.login, i18n.resolvedLanguage), {
      replace: true,
    })

    if (!accessToken) {
      toast.dismiss(loadingToastId)
      showDashboardSuccessToast({ title: t('auth:logoutSuccess') })
      return
    }

    void authService
      .logout(accessToken)
      .then(() => {
        toast.dismiss(loadingToastId)
        showDashboardSuccessToast({ title: t('auth:logoutSuccess') })
      })
      .catch(() => {
        toast.dismiss(loadingToastId)
        showDashboardErrorToast({
          title: t('auth:logoutFailed'),
          description: t('auth:logoutErrorFallback'),
        })
      })
  }

  return (
    <>
      <DropdownMenu dir="ltr" modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={t('auth:openAccountMenu')}
            data-slot="dashboard-user-menu-trigger"
            className={cn(
              'flex h-[69px] min-w-[225px] items-center justify-between rounded-xl px-3 py-[13px] shadow-[var(--dashboard-shadow)] transition-colors focus-visible:ring-2 focus-visible:ring-[#9d7e55]/20 focus-visible:outline-none',
              open
                ? 'bg-[color:var(--dashboard-surface-strong)] text-[#f8f3e8]'
                : 'bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text-soft)] hover:bg-[#ded6c4]',
              triggerClassName,
            )}
          >
            <div className="flex items-center gap-[13px]">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="size-[41px] rounded-full object-cover"
                />
              ) : (
                <span className="flex size-[41px] items-center justify-center rounded-full border border-[#d6cbb2] bg-[#f8f3e8] text-sm font-semibold text-[#402f28]">
                  {displayName.slice(0, 1)}
                </span>
              )}

              <div className={cn(dir === 'ltr' ? 'text-left' : 'text-start')}>
                <p
                  className={cn(
                    'text-[14px] leading-5 font-medium',
                    open
                      ? 'text-[#e9ddc9]'
                      : 'text-[color:var(--dashboard-text-soft)]',
                  )}
                >
                  {displayName}
                </p>
                <p
                  className={cn(
                    'text-base leading-6 font-semibold',
                    open ? 'text-white' : 'text-[color:var(--dashboard-text)]',
                  )}
                >
                  {displayRole}
                </p>
              </div>
            </div>

            <ChevronDown
              className={cn(
                'size-5 transition-transform',
                open && 'rotate-180 text-white',
              )}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align={contentAlign}
          sideOffset={12}
          collisionPadding={16}
          className={cn(
            'w-[calc(100vw-32px)] max-w-[320px] rounded-[12px] border border-[#d6cbb2] bg-[#f8f3e8] p-0 text-[#6d4f3b] shadow-[0_12px_32px_rgba(64,47,40,0.14)] ring-0 sm:w-[320px]',
            contentClassName,
          )}
        >
          <div
            data-slot="dashboard-user-menu-content"
            dir={dir}
            className="px-5 py-4"
          >
            <div className="flex items-center gap-3">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="size-12 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-12 items-center justify-center rounded-full border border-[#d6cbb2] bg-white text-base font-semibold text-[#402f28]">
                  {displayName.slice(0, 1)}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-base leading-6 font-semibold text-[#181927]">
                  {displayName}
                </p>
                {displayEmail ? (
                  <p className="truncate text-sm leading-5 font-medium text-[#6d4f3b]">
                    {displayEmail}
                  </p>
                ) : null}
                <p className="mt-1 text-xs leading-5 font-medium text-[#876647]">
                  {displayRole}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-[#d6cbb2] pt-4">
              <button
                type="button"
                disabled={isLoggingOut}
                data-slot="dashboard-user-menu-logout"
                className="flex w-full items-center justify-between rounded-[12px] border border-[#d6cbb2] bg-white px-4 py-3 text-sm leading-5 font-semibold text-[#402f28] shadow-[var(--dashboard-shadow)] transition hover:bg-[#f1eadc] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleRequestLogout}
              >
                <span>{t('auth:logout')}</span>
                <LogOut className="size-4 stroke-[2]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        dir={dir}
        title={t('auth:logoutConfirmTitle')}
        description={t('auth:logoutConfirmMessage')}
        confirmLabel={t('auth:logoutConfirmConfirm')}
        cancelLabel={t('auth:logoutConfirmCancel')}
        closeLabel={t('common:close')}
        confirmDisabled={isLoggingOut}
        cancelDisabled={isLoggingOut}
        onConfirm={handleConfirmLogout}
      />
    </>
  )
}
