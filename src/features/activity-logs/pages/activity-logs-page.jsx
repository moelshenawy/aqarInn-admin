import { useTranslation } from 'react-i18next'

import { ModulePlaceholderPage } from '@/shared/components/module-placeholder-page'

export default function ActivityLogsPage() {
  const { t } = useTranslation('common')
  return (
    <ModulePlaceholderPage
      titleKey="navigation:activityLogs"
      description={t('placeholderMessage')}
    />
  )
}
