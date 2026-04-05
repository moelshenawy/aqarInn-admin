import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AppButton } from '@/shared/components/app-button'

export function UnauthorizedPage() {
  const { t } = useTranslation('common')

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center px-4 py-10">
      <div className="border-border/70 bg-card w-full max-w-lg rounded-3xl border p-8 text-center shadow-sm">
        <div className="bg-destructive/10 text-destructive mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl">
          <ShieldAlert className="size-7" />
        </div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          {t('unauthorizedTitle')}
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          {t('unauthorizedDescription')}
        </p>
        <div className="mt-8 flex justify-center">
          <AppButton asChild>
            <Link to={ROUTE_PATHS.dashboard}>{t('backToDashboard')}</Link>
          </AppButton>
        </div>
      </div>
    </div>
  )
}
