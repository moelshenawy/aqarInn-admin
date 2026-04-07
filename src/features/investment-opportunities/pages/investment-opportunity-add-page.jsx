import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { InvestmentOpportunityForm } from '@/features/investment-opportunities/components/investment-opportunity-form'
import { INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES } from '@/features/investment-opportunities/constants/investment-opportunity-form-values'
import { InvestmentOpportunityReviewDialog } from '@/features/investment-opportunities/components/investment-opportunity-review-dialog'

const addOpportunityDescription =
  'يمكنك إضافة فرصة استثمارية جديدة من خلال تعبئة البيانات المطلوبة، ثم حفظها ليتم تسجيلها في النظام وإتاحتها للمستخدمين المصرح لهم.'

export default function InvestmentOpportunityAddPage() {
  const navigate = useNavigate()
  const [reviewOpen, setReviewOpen] = useState(false)
  const { register, handleSubmit } = useForm({
    defaultValues: INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES,
  })

  const onSubmit = handleSubmit(() => {
    setReviewOpen(true)
  })

  const handlePublish = () => {
    setReviewOpen(false)
    navigate(ROUTE_PATHS.investmentOpportunities)
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
        cancelLabel="الغاء"
        onCancel={() => navigate(ROUTE_PATHS.investmentOpportunities)}
      />
      <InvestmentOpportunityReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        onPublish={handlePublish}
      />
    </div>
  )
}
