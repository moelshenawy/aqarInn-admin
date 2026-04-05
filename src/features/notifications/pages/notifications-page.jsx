import { BellRing } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'
import { Can } from '@/lib/permissions/can'
import { AppButton } from '@/shared/components/app-button'
import { ModulePlaceholderPage } from '@/shared/components/module-placeholder-page'

export default function NotificationsPage() {
  const { t } = useTranslation('common')

  return (
    <ModulePlaceholderPage
      titleKey="navigation:notifications"
      description={t('placeholderMessage')}
      actions={
        <Can
          allOf={[
            createPermission(APP_RESOURCES.notifications, APP_ACTIONS.create),
          ]}
        >
          <AppButton>
            <BellRing className="size-4" />
            Create notification
          </AppButton>
        </Can>
      }
    />
  )
}
