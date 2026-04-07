import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { InvestmentOpportunityAddDistributionDialog } from '@/features/investment-opportunities/components/investment-opportunity-add-distribution-dialog'
import { InvestmentOpportunityDetailsTabs } from '@/features/investment-opportunities/components/investment-opportunity-details-tabs'
import { InvestmentOpportunityDistributionDetailsModal } from '@/features/investment-opportunities/components/investment-opportunity-distribution-details-modal'
import { InvestmentOpportunityDistributionsTable } from '@/features/investment-opportunities/components/investment-opportunity-distributions-table'
import { getInvestmentOpportunityDetails } from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'

export default function InvestmentOpportunityProfitDistributionsPage() {
  const { opportunityId = 'investment-riyadh-001' } = useParams()
  const [distributionDialogOpen, setDistributionDialogOpen] = useState(false)
  const [selectedDistribution, setSelectedDistribution] = useState(null)
  const details = getInvestmentOpportunityDetails(opportunityId)

  const handleDistributionDetailsOpenChange = (open) => {
    if (!open) {
      setSelectedDistribution(null)
    }
  }

  return (
    <div className="-mt-[17px] space-y-4 text-right" dir="rtl">
      <InvestmentOpportunityDetailsTabs
        opportunityId={details.id}
        activeTab="profit-distributions"
      />
      <InvestmentOpportunityDistributionsTable
        onAddDistribution={() => setDistributionDialogOpen(true)}
        onViewDistribution={setSelectedDistribution}
      />
      <InvestmentOpportunityAddDistributionDialog
        open={distributionDialogOpen}
        onOpenChange={setDistributionDialogOpen}
      />
      <InvestmentOpportunityDistributionDetailsModal
        open={Boolean(selectedDistribution)}
        onOpenChange={handleDistributionDetailsOpenChange}
        distribution={selectedDistribution}
      />
    </div>
  )
}
