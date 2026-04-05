import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/shared/components/page-header'

export function ModulePlaceholderPage({
  titleKey,
  description,
  actions,
  children,
}) {
  const { t } = useTranslation('common')

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey={titleKey}
        description={description}
        actions={actions}
      />
      <Card className="border-border/70 rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{t('overview')}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-4 text-sm leading-6">
          <p>{t('placeholderMessage')}</p>
          <p>{t('themeNote')}</p>
        </CardContent>
      </Card>
      {children}
    </div>
  )
}
