import { AlertTriangle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import {
  useBeforeUnload,
  useBlocker,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { buildInvestmentOpportunityDetailsPath } from '@/app/router/route-paths'
import { showDashboardSuccessToast } from '@/components/ui/dashboard-toast'
import { InvestmentOpportunityForm } from '@/features/investment-opportunities/components/investment-opportunity-form'
import { getInvestmentOpportunityDetails } from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'
import { createInvestmentOpportunityFormValues } from '@/features/investment-opportunities/constants/investment-opportunity-form-values'
import { ConfirmationDialog } from '@/shared/components/confirmation-dialog'

const editOpportunityDescription =
  'يمكنك تعديل بيانات الفرصة الاستثمارية من خلال تحديث الحقول المطلوبة، ثم حفظها ليتم تحديث بياناتها في النظام.'

const editSuccessToast = {
  title: 'تم تعديل الفرصة الاستثمارية بنجاح',
  description: 'تم حفظ التعديلات على بيانات الفرصة الاستثمارية.',
  actionLabel: 'إغلاق',
}

export default function InvestmentOpportunityEditPage() {
  const navigate = useNavigate()
  const { opportunityId = 'investment-riyadh-001' } = useParams()
  const details = useMemo(
    () => getInvestmentOpportunityDetails(opportunityId),
    [opportunityId],
  )
  const allowNavigationRef = useRef(false)

  const defaultValues = useMemo(
    () => createInvestmentOpportunityFormValues(details),
    [details],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({ defaultValues })

  useEffect(() => {
    reset(defaultValues)
    allowNavigationRef.current = false
  }, [defaultValues, reset])

  const detailsPath = buildInvestmentOpportunityDetailsPath(details.id)

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        isDirty &&
        !allowNavigationRef.current &&
        currentLocation.pathname !== nextLocation.pathname,
      [isDirty],
    ),
  )

  const discardOpen = blocker.state === 'blocked'

  useBeforeUnload(
    useCallback(
      (event) => {
        if (!isDirty || allowNavigationRef.current) {
          return
        }

        event.preventDefault()
        event.returnValue = ''
      },
      [isDirty],
    ),
    { capture: true },
  )

  const handleValidSave = useCallback((values) => {
    allowNavigationRef.current = true
    reset(values)
    showDashboardSuccessToast(editSuccessToast)
    navigate(detailsPath)
  }, [detailsPath, navigate, reset])

  const handleSave = useCallback(
    (event) => {
      void handleSubmit(handleValidSave)(event)
    },
    [handleSubmit, handleValidSave],
  )

  const handleDiscardOpenChange = (nextOpen) => {
    if (nextOpen) {
      return
    }

    if (blocker.state === 'blocked') {
      blocker.reset()
    }
  }

  const handleLeaveWithoutSaving = () => {
    allowNavigationRef.current = true

    if (blocker.state === 'blocked') {
      blocker.proceed()
    }
  }

  return (
    <div className="pb-8 text-start" dir="rtl">
      <InvestmentOpportunityForm
        breadcrumbCurrent="تعديل الفرصة الاستثمارية"
        title="تعديل الفرصة الاستثمارية"
        description={editOpportunityDescription}
        register={register}
        onSubmit={handleSave}
        submitLabel="حفظ التعديلات"
        cancelLabel="الغاء"
        onCancel={() => navigate(detailsPath)}
      />

      <ConfirmationDialog
        open={discardOpen}
        onOpenChange={handleDiscardOpenChange}
        title="مغادرة الصفحة دون حفظ؟"
        description="لديك تغييرات غير محفوظة. هل تريد مغادرة الصفحة بدون حفظ التعديلات؟"
        icon={
          <AlertTriangle
            className="size-[30px] text-[#b42318]"
            aria-hidden="true"
          />
        }
        confirmLabel="مغادرة"
        cancelLabel="البقاء"
        confirmVariant="destructive"
        onConfirm={handleLeaveWithoutSaving}
      />
    </div>
  )
}
