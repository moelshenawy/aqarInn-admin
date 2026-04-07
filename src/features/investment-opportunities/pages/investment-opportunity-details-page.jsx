import { useParams } from 'react-router-dom'

import {
  InvestmentOpportunityDetailsActions,
  InvestmentOpportunityDetailsBody,
} from '@/features/investment-opportunities/components/investment-opportunity-details-content'
import { InvestmentOpportunityDetailsTabs } from '@/features/investment-opportunities/components/investment-opportunity-details-tabs'
import { getInvestmentOpportunityDetails } from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'

export default function InvestmentOpportunityDetailsPage() {
  const { opportunityId = 'investment-riyadh-001' } = useParams()
  const details = getInvestmentOpportunityDetails(opportunityId)

  return (
    <div className="-mt-[17px] space-y-4 text-right" dir="rtl">
      <InvestmentOpportunityDetailsTabs
        opportunityId={details.id}
        activeTab="details"
      />

      <section className="overflow-hidden bg-[#f8f3e8] p-2.5">
        <div className="flex flex-col gap-[30px]">
          <header
            dir="ltr"
            className="flex w-full items-center justify-end gap-[58px] py-2.5"
          >
            <InvestmentOpportunityDetailsActions />
            <h1
              dir="rtl"
              className="min-w-0 flex-1 text-right text-2xl leading-8 font-semibold text-[#181927]"
            >
              عرض تفاصيل الفرصة الاستثمارية
            </h1>
          </header>

          <InvestmentOpportunityDetailsBody details={details} />
        </div>
      </section>
    </div>
  )
}
