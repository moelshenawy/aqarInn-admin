import { Plus, Rocket } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'
import { Can } from '@/lib/permissions/can'
import { AppButton } from '@/shared/components/app-button'
import { DataTableShell } from '@/shared/components/data-table-shell'
import { ModulePlaceholderPage } from '@/shared/components/module-placeholder-page'
import { INVESTMENT_STATUS_OPTIONS } from '@/shared/constants/investment-status-options'

const rows = [
  {
    id: 'RES-RUH-001',
    title: 'Riyadh Residences Alpha',
    sharesAmount: 5000,
    capitalRaised: '74%',
    status: 'published',
  },
  {
    id: 'COM-DMM-523',
    title: 'Dammam Commerce Park',
    sharesAmount: 2400,
    capitalRaised: '31%',
    status: 'draft',
  },
]

export default function InvestmentOpportunitiesPage() {
  const { t } = useTranslation('common')
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Title' },
    { key: 'sharesAmount', header: 'Shares' },
    { key: 'capitalRaised', header: 'Raised' },
    {
      key: 'status',
      header: t('status'),
      cell: (row) => {
        const status = INVESTMENT_STATUS_OPTIONS.find(
          (item) => item.code === row.status,
        )
        return <Badge variant="outline">{status?.label ?? row.status}</Badge>
      },
    },
  ]

  return (
    <ModulePlaceholderPage
      titleKey="navigation:investmentOpportunities"
      description={t('placeholderMessage')}
      actions={
        <div className="flex flex-wrap gap-2">
          <Can
            allOf={[
              createPermission(
                APP_RESOURCES.investmentOpportunities,
                APP_ACTIONS.create,
              ),
            ]}
          >
            <AppButton>
              <Plus className="size-4" />
              Add opportunity
            </AppButton>
          </Can>
          <Can
            allOf={[
              createPermission(
                APP_RESOURCES.investmentOpportunities,
                APP_ACTIONS.publish,
              ),
            ]}
          >
            <AppButton variant="outline">
              <Rocket className="size-4" />
              Publish ready items
            </AppButton>
          </Can>
        </div>
      }
    >
      <DataTableShell columns={columns} data={rows} />
    </ModulePlaceholderPage>
  )
}
