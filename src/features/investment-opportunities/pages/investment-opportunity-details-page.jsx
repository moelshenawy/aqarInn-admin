import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  buildInvestmentOpportunityEditPath,
  ROUTE_PATHS,
} from '@/app/router/route-paths'
import { showDashboardSuccessToast } from '@/components/ui/dashboard-toast'
import {
  InvestmentOpportunityDetailsActions,
  InvestmentOpportunityDetailsBody,
} from '@/features/investment-opportunities/components/investment-opportunity-details-content'
import { InvestmentOpportunityDetailsTabs } from '@/features/investment-opportunities/components/investment-opportunity-details-tabs'
import { getInvestmentOpportunityDetails } from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'
import { ConfirmationDialog } from '@/shared/components/confirmation-dialog'

const deleteSuccessToast = {
  title: 'تم حذف الفرصة الاستثمارية بنجاح',
  description: 'تم حذف الفرصة من قائمة الفرص الاستثمارية.',
  actionLabel: 'إغلاق',
}

export default function InvestmentOpportunityDetailsPage() {
  const navigate = useNavigate()
  const { opportunityId = 'investment-riyadh-001' } = useParams()
  const details = getInvestmentOpportunityDetails(opportunityId)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleConfirmDelete = () => {
    setDeleteOpen(false)
    showDashboardSuccessToast(deleteSuccessToast)
    navigate(ROUTE_PATHS.investmentOpportunities)
  }

  return (
    <div className="-mt-[17px] space-y-4 text-start" dir="rtl">
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
            <InvestmentOpportunityDetailsActions
              onDelete={() => setDeleteOpen(true)}
              onEdit={() =>
                navigate(buildInvestmentOpportunityEditPath(details.id))
              }
            />
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

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف الفرصة الاستثمارية"
        description="هل أنت متأكد من حذف الفرصة الاستثمارية؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        cancelLabel="الغاء"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
