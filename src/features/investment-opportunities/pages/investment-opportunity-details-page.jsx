import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  buildInvestmentOpportunityEditPath,
  ROUTE_PATHS,
} from '@/app/router/route-paths'
import {
  showDashboardErrorToast,
  showDashboardSuccessToast,
} from '@/components/ui/dashboard-toast'
import { Skeleton } from '@/components/ui/skeleton'
import {
  InvestmentOpportunityDetailsActions,
  InvestmentOpportunityDetailsBody,
} from '@/features/investment-opportunities/components/investment-opportunity-details-content'
import { InvestmentOpportunityDetailsTabs } from '@/features/investment-opportunities/components/investment-opportunity-details-tabs'
import { mapOpportunityApiToDetails } from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'
import { useDeleteOpportunityMutation } from '@/features/investment-opportunities/hooks/use-delete-opportunity-mutation'
import { useOpportunityDetailsQuery } from '@/features/investment-opportunities/hooks/use-opportunity-details-query'
import { ConfirmationDialog } from '@/shared/components/confirmation-dialog'
import {
  APP_ACTIONS,
  APP_RESOURCES,
  createPermission,
} from '@/lib/permissions/constants'
import { useAuthorization } from '@/lib/permissions/use-authorization'
import { useDirection } from '@/lib/i18n/direction-provider'

const deleteSuccessToast = {
  title: 'تم حذف الفرصة الاستثمارية بنجاح',
  description: 'تم حذف الفرصة من قائمة الفرص الاستثمارية.',
  actionLabel: 'إغلاق',
}

const deleteErrorToast = {
  title: 'فشل حذف الفرصة الاستثمارية',
  description: 'تعذر حذف الفرصة الاستثمارية. يرجى المحاولة مرة أخرى.',
  actionLabel: 'إغلاق',
}

export default function InvestmentOpportunityDetailsPage() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { dir } = useDirection()
  const { opportunityId = '' } = useParams()
  const { hasAllPermissions } = useAuthorization()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: opportunity, isLoading } =
    useOpportunityDetailsQuery(opportunityId)
  const deleteOpportunityMutation = useDeleteOpportunityMutation()
  const canEditOpportunity = hasAllPermissions([
    createPermission(APP_RESOURCES.investmentOpportunities, APP_ACTIONS.edit),
  ])
  const canDeleteOpportunity =
    hasAllPermissions([
      createPermission(
        APP_RESOURCES.investmentOpportunities,
        APP_ACTIONS.delete,
      ),
    ]) && opportunity?.status === 'draft'

  const details = useMemo(
    () =>
      mapOpportunityApiToDetails(opportunity, {
        opportunityId,
        language: i18n.resolvedLanguage,
        useStaticFallback: false,
      }),
    [i18n.resolvedLanguage, opportunity, opportunityId],
  )

  const handleConfirmDelete = () => {
    if (!canDeleteOpportunity || deleteOpportunityMutation.isPending) {
      return
    }

    deleteOpportunityMutation.mutate(opportunityId, {
      onSuccess: () => {
        setDeleteOpen(false)
        showDashboardSuccessToast(deleteSuccessToast)
        navigate(
          ROUTE_PATHS.withLocale(
            ROUTE_PATHS.investmentOpportunities,
            i18n.resolvedLanguage,
          ),
        )
      },
      onError: () => {
        setDeleteOpen(false)
        showDashboardErrorToast(deleteErrorToast)
      },
    })
  }

  const handleDeleteClick = () => {
    if (!canDeleteOpportunity || deleteOpportunityMutation.isPending) {
      return
    }

    setDeleteOpen(true)
  }

  return (
    <div className="-mt-[17px] space-y-4 text-start" dir="rtl">
      <InvestmentOpportunityDetailsTabs
        opportunityId={details.id || opportunityId}
        activeTab="details"
      />

      <section className="overflow-hidden bg-[#f8f3e8] p-2.5">
        <div className="flex flex-col gap-[30px]">
          <header
            dir={dir}
            className="flex w-full items-center justify-end gap-[58px] py-2.5"
          >
            <h1
              dir={dir}
              className="min-w-0 flex-1 text-start text-2xl leading-8 font-semibold text-[#181927]"
            >
              {i18n.resolvedLanguage === 'en'
                ? 'View investment opportunity details'
                : 'عرض تفاصيل الفرصة الاستثمارية'}
            </h1>
            <InvestmentOpportunityDetailsActions
              showDelete={canDeleteOpportunity}
              showEdit={canEditOpportunity}
              onDelete={handleDeleteClick}
              onEdit={
                canEditOpportunity
                  ? () =>
                      navigate(
                        buildInvestmentOpportunityEditPath(
                          details.id,
                          i18n.resolvedLanguage,
                        ),
                      )
                  : undefined
              }
            />
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
        cancelLabel="إلغاء"
        confirmVariant="destructive"
        confirmDisabled={deleteOpportunityMutation.isPending}
        cancelDisabled={deleteOpportunityMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
