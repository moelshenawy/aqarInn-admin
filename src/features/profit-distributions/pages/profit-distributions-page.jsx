import { Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'
import { Can } from '@/lib/permissions/can'
import { AppButton } from '@/shared/components/app-button'
import { ModulePlaceholderPage } from '@/shared/components/module-placeholder-page'

export default function ProfitDistributionsPage() {
  const { t } = useTranslation('common')

  return (
    <ModulePlaceholderPage
      titleKey="navigation:profitDistributions"
      description={t('placeholderMessage')}
      actions={
        <Can
          allOf={[
            createPermission(
              APP_RESOURCES.profitDistributions,
              APP_ACTIONS.distributeProfits,
            ),
          ]}
        >
          <AppButton>
            <Wallet className="size-4" />
            Distribute profits
          </AppButton>
        </Can>
      }
    />
  )
}
