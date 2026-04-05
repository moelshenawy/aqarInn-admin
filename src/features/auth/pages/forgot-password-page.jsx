import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AppButton } from '@/shared/components/app-button'

export default function ForgotPasswordPage() {
  const { t } = useTranslation('auth')

  return (
    <Card className="border-border/70 bg-white/90 shadow-none">
      <CardHeader className="space-y-3 px-0 pt-0">
        <CardTitle className="text-foreground text-2xl font-semibold tracking-tight">
          {t('forgotPasswordTitle')}
        </CardTitle>
        <p className="text-muted-foreground text-sm leading-6">
          {t('forgotPasswordDescription')}
        </p>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <AppButton asChild>
          <Link to={ROUTE_PATHS.login}>{t('goBackToLogin')}</Link>
        </AppButton>
      </CardContent>
    </Card>
  )
}
