import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  buildInvestmentOpportunityEditPath,
  ROUTE_PATHS,
} from '@/app/router/route-paths'
import { showDashboardSuccessToast } from '@/components/ui/dashboard-toast'
import { Skeleton } from '@/components/ui/skeleton'
import {
  InvestmentOpportunityDetailsActions,
  InvestmentOpportunityDetailsBody,
} from '@/features/investment-opportunities/components/investment-opportunity-details-content'
import { InvestmentOpportunityDetailsTabs } from '@/features/investment-opportunities/components/investment-opportunity-details-tabs'
import {
  investmentOpportunityDefaultDetails,
  mapOpportunityApiToDetails,
} from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'
import { useOpportunityDetailsQuery } from '@/features/investment-opportunities/hooks/use-opportunity-details-query'
import { ConfirmationDialog } from '@/shared/components/confirmation-dialog'

const deleteSuccessToast = {
  title: 'تم حذف الفرصة الاستثمارية بنجاح',
  description: 'تم حذف الفرصة من قائمة الفرص الاستثمارية.',
  actionLabel: 'إغلاق',
}

export default function InvestmentOpportunityDetailsPage() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const dir = i18n.resolvedLanguage === 'ar' ? 'rtl' : 'ltr'
  const { opportunityId = 'investment-riyadh-001' } = useParams()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { data: opportunity, isLoading } =
    useOpportunityDetailsQuery(opportunityId)

  const details = useMemo(
    () =>
      mapOpportunityApiToDetails(opportunity, {
        opportunityId,
        language: i18n.resolvedLanguage,
      }),
    [i18n.resolvedLanguage, opportunity, opportunityId],
  )

  const handleConfirmDelete = () => {
    setDeleteOpen(false)
    showDashboardSuccessToast(deleteSuccessToast)
    navigate(
      ROUTE_PATHS.withLocale(
        ROUTE_PATHS.investmentOpportunities,
        i18n.resolvedLanguage,
      ),
    )
  }

  return (
    <div className="-mt-[17px] space-y-4 text-start" dir="rtl">
      <InvestmentOpportunityDetailsTabs
        opportunityId={details.id || investmentOpportunityDefaultDetails.id}
        activeTab="details"
      />

      <section className="overflow-hidden bg-[#f8f3e8] p-2.5">
        <div className="flex flex-col gap-[30px]">
          <header
            dir={dir}
            className="flex w-full items-center justify-end gap-[58px] py-2.5"
          >
            <InvestmentOpportunityDetailsActions
              onDelete={() => setDeleteOpen(true)}
              onEdit={() =>
                navigate(
                  buildInvestmentOpportunityEditPath(
                    details.id,
                    i18n.resolvedLanguage,
                  ),
                )
              }
            />
            <h1
              dir="rtl"
              className="min-w-0 flex-1 text-start text-2xl leading-8 font-semibold text-[#181927]"
            >
              عرض تفاصيل الفرصة الاستثمارية
            </h1>
          </header>

          {isLoading && !opportunity ? (
            <div className="grid min-h-[240px] gap-4 rounded-xl border border-[#eae5d7] bg-[#f8f3e8] p-6">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-8 w-1/3 rounded-full bg-[#d6cbb2]" />
                <Skeleton className="h-8 w-1/4 rounded-full bg-[#d6cbb2]" />
              </div>
              <div className="grid gap-3">
                <Skeleton className="h-5 w-full rounded-md bg-[#d6cbb2]" />
                <Skeleton className="h-5 w-5/6 rounded-md bg-[#d6cbb2]" />
                <Skeleton className="h-5 w-2/3 rounded-md bg-[#d6cbb2]" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-10 w-28 rounded-full bg-[#d6cbb2]" />
                <Skeleton className="h-10 w-20 rounded-full bg-[#d6cbb2]" />
                <Skeleton className="h-10 w-24 rounded-full bg-[#d6cbb2]" />
              </div>
            </div>
          ) : (
            <InvestmentOpportunityDetailsBody details={details} />
          )}
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
