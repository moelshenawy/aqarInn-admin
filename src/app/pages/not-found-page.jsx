import { SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LocalizedLink } from '@/shared/components/localized-link'
import { useTranslation } from 'react-i18next'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AppButton } from '@/shared/components/app-button'

export function NotFoundPage() {
  const { t } = useTranslation('common')

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center px-4 py-10">
      <div className="border-border/70 bg-card w-full max-w-lg rounded-3xl border p-8 text-center shadow-sm">
        <div className="bg-primary/10 text-primary mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl">
          <SearchX className="size-7" />
        </div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          {t('notFoundTitle')}
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          {t('notFoundDescription')}
        </p>
        <div className="mt-8 flex justify-center">
          <AppButton asChild>
            <LocalizedLink to={ROUTE_PATHS.dashboard}>
              {t('backToDashboard')}
            </LocalizedLink>
          </AppButton>
        </div>
      </div>
    </div>
  )
}
