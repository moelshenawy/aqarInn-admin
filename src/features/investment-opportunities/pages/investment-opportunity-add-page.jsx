import { useMemo, useState } from 'react'
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
import { useCitiesQuery } from '@/features/investment-opportunities/hooks/use-cities-query'
import {
  useCreateOpportunityDraftMutation,
  useCreateOpportunityMutation,
} from '@/features/investment-opportunities/hooks/use-create-opportunity-mutations'
import {
  createInvestmentOpportunityDraftSchema,
  createInvestmentOpportunityPublishSchema,
} from '@/features/investment-opportunities/schemas/investment-opportunity-form-schema'
import { buildOpportunityFormData } from '@/features/investment-opportunities/services/build-opportunity-form-data'
import { investmentOpportunityDefaultDetails } from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'

const addOpportunityDescription =
  'يمكنك إضافة فرصة استثمارية جديدة من خلال تعبئة البيانات المطلوبة، ثم حفظها ليتم تسجيلها في النظام وإتاحتها للمستخدمين المصرح لهم.'

const saveDraftSuccessToast = {
  title: 'تم حفظ الفرصة كمسودة',
  description: 'تم حفظ بيانات الفرصة الاستثمارية بحالة مسودة بنجاح.',
  actionLabel: 'إغلاق',
}

const publishSuccessToast = {
  title: 'تم نشر الفرصة الاستثمارية بنجاح',
  description: 'تم إنشاء الفرصة الاستثمارية وتحويل حالتها إلى منشورة.',
  actionLabel: 'إغلاق',
}

function resolveApiErrorMessage(error, t) {
  const message = error?.message

  if (typeof message === 'string' && message.startsWith('validation.')) {
    return t(message, { ns: 'validation' })
  }

  if (typeof message === 'string' && message.trim()) {
    return message
  }

  return t('unexpectedError', { ns: 'validation' })
}

function mapSchemaErrorsToForm(parsedResult, setError, clearErrors) {
  clearErrors()

  if (parsedResult.success) {
    return true
  }

  parsedResult.error.issues.forEach((issue) => {
    const fieldName = issue.path[0]

    if (!fieldName || typeof fieldName !== 'string') {
      return
    }

    setError(fieldName, {
      type: 'manual',
      message: issue.message,
    })
  })

  return false
}

function buildReviewDetails(values, cityName) {
  return {
    ...investmentOpportunityDefaultDetails,
    titleAr: values.titleAr || investmentOpportunityDefaultDetails.titleAr,
    titleEn: values.titleEn || investmentOpportunityDefaultDetails.titleEn,
    propertyType:
      values.propertyType === 'commercial' ? 'عقار تجاري' : 'عقار سكني',
    floors: values.floorCount
      ? `${values.floorCount} أدوار`
      : investmentOpportunityDefaultDetails.floors,
    totalArea: values.propertyArea
      ? `${values.propertyArea} م² مساحة إجمالية`
      : investmentOpportunityDefaultDetails.totalArea,
    buildYear: values.buildYear || investmentOpportunityDefaultDetails.buildYear,
    location:
      [values.neighborhood, cityName].filter(Boolean).join('، ') ||
      values.propertyLocation ||
      investmentOpportunityDefaultDetails.location,
    metrics: [
      {
        label: 'العائد الصافي المتوقع',
        value:
          values.expectedNetReturn ||
          investmentOpportunityDefaultDetails.metrics[0].value,
      },
      {
        label: 'العائد المتوقع',
        value:
          values.expectedReturn || investmentOpportunityDefaultDetails.metrics[1].value,
      },
      {
        label: 'عدد الحصص',
        value: values.shareCount || investmentOpportunityDefaultDetails.metrics[2].value,
      },
      {
        label: 'سعر الحصة',
        value: values.sharePrice || investmentOpportunityDefaultDetails.metrics[3].value,
      },
      {
        label: 'سعر العقار',
        value:
          values.propertyPrice ||
          investmentOpportunityDefaultDetails.metrics[4].value,
        currency: true,
      },
    ],
    investmentSettings: [
      {
        label: 'تاريخ بداية الاستثمار',
        value:
          values.investmentStartDate ||
          investmentOpportunityDefaultDetails.investmentSettings[0].value,
      },
      {
        label: 'جدولة بداية الاستثمار',
        value: values.scheduleInvestmentStart === 'no' ? 'لا' : 'نعم',
      },
    ],
    operator: {
      ...investmentOpportunityDefaultDetails.operator,
      nameAr:
        values.developerNameAr || investmentOpportunityDefaultDetails.operator.nameAr,
      nameEn:
        values.developerNameEn || investmentOpportunityDefaultDetails.operator.nameEn,
      descriptionAr:
        values.developerDescriptionAr ||
        investmentOpportunityDefaultDetails.operator.descriptionAr,
      descriptionEn:
        values.developerDescriptionEn ||
        investmentOpportunityDefaultDetails.operator.descriptionEn,
      email:
        values.developerEmail || investmentOpportunityDefaultDetails.operator.email,
      phone: values.developerPhone
        ? `+966 ${values.developerPhone}`
        : investmentOpportunityDefaultDetails.operator.phone,
      location:
        values.developerLocation ||
        investmentOpportunityDefaultDetails.operator.location,
    },
  }
}

export default function InvestmentOpportunityAddPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation(['validation'])
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewDetails, setReviewDetails] = useState(
    investmentOpportunityDefaultDetails,
  )
  const { data: cities = [] } = useCitiesQuery()
  const createOpportunityMutation = useCreateOpportunityMutation()
  const createDraftMutation = useCreateOpportunityDraftMutation()
  const {
    register,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES,
  })

  const publishSchema = useMemo(
    () => createInvestmentOpportunityPublishSchema(t),
    [t],
  )
  const draftSchema = useMemo(() => createInvestmentOpportunityDraftSchema(t), [t])

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        value: city.id,
        label: i18n.resolvedLanguage === 'en' ? city.name_en : city.name_ar,
      })),
    [cities, i18n.resolvedLanguage],
  )

  const isSubmitting =
    createOpportunityMutation.isPending || createDraftMutation.isPending

  const navigateToList = () => {
    navigate(
      ROUTE_PATHS.withLocale(
        ROUTE_PATHS.investmentOpportunities,
        i18n.resolvedLanguage,
      ),
    )
  }

  const handleContinue = (event) => {
    event.preventDefault()

    const formValues = getValues()
    const parsed = publishSchema.safeParse(formValues)
    const isValid = mapSchemaErrorsToForm(parsed, setError, clearErrors)

    if (!isValid) {
      showDashboardErrorToast({
        title: t('invalidSubmission', { ns: 'validation' }),
        description: t('required', { ns: 'validation' }),
        actionLabel: 'إغلاق',
      })
      return
    }

    const cityName =
      cityOptions.find((cityOption) => cityOption.value === formValues.cityId)
        ?.label ?? ''
    setReviewDetails(buildReviewDetails(formValues, cityName))
    setReviewOpen(true)
  }

  const handleSaveDraft = async () => {
    const formValues = getValues()
    const parsed = draftSchema.safeParse(formValues)
    const isValid = mapSchemaErrorsToForm(parsed, setError, clearErrors)

    if (!isValid) {
      showDashboardErrorToast({
        title: t('invalidSubmission', { ns: 'validation' }),
        description: t('required', { ns: 'validation' }),
        actionLabel: 'إغلاق',
      })
      return
    }

    try {
      const formData = buildOpportunityFormData(formValues, { mode: 'draft' })
      await createDraftMutation.mutateAsync(formData)
      showDashboardSuccessToast(saveDraftSuccessToast)
      navigateToList()
    } catch (error) {
      showDashboardErrorToast({
        title: 'تعذر حفظ المسودة',
        description: resolveApiErrorMessage(error, t),
        actionLabel: 'إغلاق',
      })
    }
  }

  const handlePublish = async () => {
    const formValues = getValues()

    try {
      const formData = buildOpportunityFormData(formValues, { mode: 'publish' })
      await createOpportunityMutation.mutateAsync(formData)
      setReviewOpen(false)
      showDashboardSuccessToast(publishSuccessToast)
      navigateToList()
    } catch (error) {
      showDashboardErrorToast({
        title: 'تعذر نشر الفرصة',
        description: resolveApiErrorMessage(error, t),
        actionLabel: 'إغلاق',
      })
    }
  }

  return (
    <div className="pb-8 text-start" dir="rtl">
      <InvestmentOpportunityForm
        breadcrumbCurrent="إضافة فرصة استثمارية"
        title="إضافة فرصة استثمارية جديدة"
        description={addOpportunityDescription}
        register={register}
        errors={errors}
        onSubmit={handleContinue}
        submitLabel="التالي"
        draftLabel="حفظ كمسودة"
        onDraft={handleSaveDraft}
        cancelLabel="الغاء"
        isSubmitting={isSubmitting}
        cityOptions={cityOptions}
        onCancel={navigateToList}
      />
      <InvestmentOpportunityReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        onPublish={handlePublish}
        details={reviewDetails}
        isPublishing={createOpportunityMutation.isPending}
      />
    </div>
  )
}
