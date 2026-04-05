import {
  Building2,
  ChartNoAxesColumn,
  ShieldCheck,
  WalletCards,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/shared/components/page-header'

const METRICS = [
  { icon: Building2, label: 'Active modules', value: '6' },
  { icon: ChartNoAxesColumn, label: 'Query client', value: 'Ready' },
  { icon: ShieldCheck, label: 'Permissions', value: 'Role-based' },
  { icon: WalletCards, label: 'API client', value: 'Intercepted' },
]

export default function DashboardPage() {
  const { t } = useTranslation('common')

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="navigation:dashboard"
        description={t('shellReady')}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => {
          const Icon = metric.icon
          return (
            <Card
              key={metric.label}
              className="border-border/70 rounded-3xl shadow-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {metric.label}
                </CardTitle>
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-2xl">
                  <Icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground text-2xl font-semibold tracking-tight">
                  {metric.value}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <Card className="border-border/70 rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Foundation notes</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3 text-sm leading-6">
          <p>{t('placeholderMessage')}</p>
          <p>{t('themeNote')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
