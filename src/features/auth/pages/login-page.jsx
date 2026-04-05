import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AppButton } from '@/shared/components/app-button'

export default function LoginPage() {
  const { t } = useTranslation(['auth'])

  return (
    <Card className="border-border/70 bg-white/90 shadow-none">
      <CardHeader className="space-y-3 px-0 pt-0">
        <CardTitle className="text-foreground text-2xl font-semibold tracking-tight">
          {t('auth:loginTitle')}
        </CardTitle>
        <p className="text-muted-foreground text-sm leading-6">
          {t('auth:loginDescription')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-0">
        <div className="border-border bg-muted/40 text-muted-foreground rounded-2xl border border-dashed p-4 text-sm leading-6">
          {t('auth:frontendOnlyHint')}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <AppButton asChild className="w-full sm:w-auto">
            <Link to={ROUTE_PATHS.dashboard}>
              {t('auth:openDashboardPreview')}
            </Link>
          </AppButton>
          <AppButton asChild variant="ghost" className="w-full sm:w-auto">
            <Link to={ROUTE_PATHS.forgotPassword}>
              {t('auth:viewAuthPlaceholder')}
            </Link>
          </AppButton>
        </div>
      </CardContent>
    </Card>
  )
}
