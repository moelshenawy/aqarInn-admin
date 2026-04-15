import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  showDashboardErrorToast,
  showDashboardSuccessToast,
} from '@/components/ui/dashboard-toast'
import { InvestmentOpportunityForm } from '@/features/investment-opportunities/components/investment-opportunity-form'
import { InvestmentOpportunityReviewDialog } from '@/features/investment-opportunities/components/investment-opportunity-review-dialog'
import { INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES } from '@/features/investment-opportunities/constants/investment-opportunity-form-values'

const addOpportunityDescription =
  'يمكنك إضافة فرصة استثمارية جديدة من خلال تعبئة البيانات المطلوبة، ثم حفظها ليتم تسجيلها في النظام وإتاحتها للمستخدمين المصرح لهم.'

const basicInformationFieldNames = ['titleAr', 'titleEn']

const saveDraftSuccessToast = {
  title: 'تم حفظ الفرصة كمسودة',
  description:
    'تم إنشاء الفرصة الاستثمارية بحالة مسودة وتسجيل معلومات المراجعة (المستخدم، الإجراء، التاريخ والوقت).',
  actionLabel: 'إغلاق',
}

const saveDraftErrorToast = {
  title: 'تعذر حفظ المسودة',
  description: 'يجب إكمال حقول المعلومات الأساسية قبل حفظ الفرصة كمسودة.',
  actionLabel: 'إغلاق',
}

export default function InvestmentOpportunityAddPage() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const [reviewOpen, setReviewOpen] = useState(false)
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES,
  })

  const onSubmit = handleSubmit(() => {
    setReviewOpen(true)
  })

  const handlePublish = () => {
    setReviewOpen(false)
    navigate(
      ROUTE_PATHS.withLocale(
        ROUTE_PATHS.investmentOpportunities,
        i18n.resolvedLanguage,
      ),
    )
  }

  const handleSaveDraft = () => {
    const formValues = getValues()
    const hasBasicInformation = basicInformationFieldNames.every((fieldName) =>
      String(formValues[fieldName] ?? '').trim(),
    )

    if (!hasBasicInformation) {
      showDashboardErrorToast(saveDraftErrorToast)
      return
    }

    showDashboardSuccessToast(saveDraftSuccessToast)
    navigate(
      ROUTE_PATHS.withLocale(
        ROUTE_PATHS.investmentOpportunities,
        i18n.resolvedLanguage,
      ),
    )
  }

  return (
    <div className="pb-8 text-start" dir="rtl">
      <InvestmentOpportunityForm
        breadcrumbCurrent="إضافة فرصة استثمارية"
        title="إضافة فرصة استثمارية جديدة"
        description={addOpportunityDescription}
        register={register}
        onSubmit={onSubmit}
        submitLabel="التالي"
        draftLabel="حفظ كمسودة"
        onDraft={handleSaveDraft}
        cancelLabel="الغاء"
        onCancel={() =>
          navigate(
            ROUTE_PATHS.withLocale(
              ROUTE_PATHS.investmentOpportunities,
              i18n.resolvedLanguage,
            ),
          )
        }
      />
      <InvestmentOpportunityReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        onPublish={handlePublish}
      />
    </div>
  )
}
