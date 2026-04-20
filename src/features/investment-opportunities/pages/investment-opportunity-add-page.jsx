import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDirection } from '@/lib/i18n/direction-provider'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  showDashboardErrorToast,
  showDashboardSuccessToast,
} from '@/components/ui/dashboard-toast'
import { InvestmentOpportunityForm } from '@/features/investment-opportunities/components/investment-opportunity-form'
import { InvestmentOpportunityNeighborhoodMapDialog } from '@/features/investment-opportunities/components/investment-opportunity-neighborhood-map-dialog'
import { InvestmentOpportunityReviewDialog } from '@/features/investment-opportunities/components/investment-opportunity-review-dialog'
import { INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES } from '@/features/investment-opportunities/constants/investment-opportunity-form-values'
import { useCitiesQuery } from '@/features/investment-opportunities/hooks/use-cities-query'
import {
  useCreateOpportunityDraftMutation,
  useCreateOpportunityMutation,
} from '@/features/investment-opportunities/hooks/use-create-opportunity-mutations'
import { useInvestmentOpportunityFileUploadState } from '@/features/investment-opportunities/hooks/use-investment-opportunity-file-upload-state'
import {
  createInvestmentOpportunityDraftSchema,
  createInvestmentOpportunityPublishSchema,
} from '@/features/investment-opportunities/schemas/investment-opportunity-form-schema'
import { buildOpportunityFormData } from '@/features/investment-opportunities/services/build-opportunity-form-data'
import {
  investmentOpportunityDefaultDetails,
  investmentOpportunityGalleryTileClassNames,
} from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'

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

function parseNumber(value) {
  const normalized = String(value ?? '')
    .replace(/,/g, '')
    .trim()

  if (!normalized) {
    return null
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeArabicIndicDigits(value) {
  const normalized = String(value ?? '')
  const arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  const easternArabicIndic = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

  return normalized.replace(/[٠-٩۰-۹]/g, (digit) => {
    const arabicIndex = arabicIndic.indexOf(digit)
    if (arabicIndex >= 0) {
      return String(arabicIndex)
    }

    const easternArabicIndex = easternArabicIndic.indexOf(digit)
    if (easternArabicIndex >= 0) {
      return String(easternArabicIndex)
    }

    return digit
  })
}

function normalizeSaudiMobileInput(value) {
  let digitsOnly = normalizeArabicIndicDigits(value).replace(/\D/g, '')

  if (digitsOnly.startsWith('00966')) {
    digitsOnly = digitsOnly.slice(5)
  } else if (digitsOnly.startsWith('966')) {
    digitsOnly = digitsOnly.slice(3)
  }

  if (digitsOnly.startsWith('0')) {
    digitsOnly = digitsOnly.slice(1)
  }

  return digitsOnly
}

function buildSubmissionValues(values, managedFiles) {
  return {
    ...values,
    developerPhone: normalizeSaudiMobileInput(values.developerPhone),
    propertyDocuments: managedFiles.propertyDocuments,
    propertyImages: managedFiles.propertyImages,
    virtualTour: managedFiles.virtualTour,
    developerLogo: managedFiles.developerLogo,
  }
}

function buildReviewGallery(previewUrls = []) {
  return previewUrls
    .slice(0, investmentOpportunityGalleryTileClassNames.length)
    .map((src, index) => ({
      src,
      alt: investmentOpportunityDefaultDetails.gallery[index]?.alt ?? '',
      tileClassName: investmentOpportunityGalleryTileClassNames[index],
    }))
}

function buildReviewDetails(
  values,
  cityName,
  previewUrls = [],
  reviewDetailsCopy,
  locationSeparator = ', ',
) {
  return {
    ...investmentOpportunityDefaultDetails,
    title:
      values.titleAr ||
      values.titleEn ||
      investmentOpportunityDefaultDetails.title,
    titleAr: values.titleAr || investmentOpportunityDefaultDetails.titleAr,
    titleEn: values.titleEn || investmentOpportunityDefaultDetails.titleEn,
    propertyType:
      values.propertyType === 'commercial'
        ? reviewDetailsCopy.propertyType.commercial
        : reviewDetailsCopy.propertyType.residential,
    floors: values.floorCount
      ? `${values.floorCount} ${reviewDetailsCopy.units.floors}`
      : investmentOpportunityDefaultDetails.floors,
    totalArea: values.propertyArea
      ? `${values.propertyArea} ${reviewDetailsCopy.units.totalArea}`
      : investmentOpportunityDefaultDetails.totalArea,
    buildYear: values.buildYear || investmentOpportunityDefaultDetails.buildYear,
    locationDisplay:
      [values.neighborhood, cityName].filter(Boolean).join(locationSeparator) ||
      values.propertyLocation ||
      investmentOpportunityDefaultDetails.locationDisplay,
    location:
      [values.neighborhood, cityName].filter(Boolean).join(locationSeparator) ||
      values.propertyLocation ||
      investmentOpportunityDefaultDetails.location,
    metrics: [
      {
        label: reviewDetailsCopy.metrics.expectedNetReturn,
        value:
          values.expectedNetReturn ||
          investmentOpportunityDefaultDetails.metrics[0].value,
      },
      {
        label: reviewDetailsCopy.metrics.expectedReturn,
        value:
          values.expectedReturn || investmentOpportunityDefaultDetails.metrics[1].value,
      },
      {
        label: reviewDetailsCopy.metrics.shareCount,
        value: values.shareCount || investmentOpportunityDefaultDetails.metrics[2].value,
      },
      {
        label: reviewDetailsCopy.metrics.sharePrice,
        value: values.sharePrice || investmentOpportunityDefaultDetails.metrics[3].value,
      },
      {
        label: reviewDetailsCopy.metrics.propertyPrice,
        value:
          values.propertyPrice ||
          investmentOpportunityDefaultDetails.metrics[4].value,
        currency: true,
      },
    ],
    gallery: buildReviewGallery(previewUrls),
    investmentSettings: [
      {
        label: reviewDetailsCopy.investmentSettings.startDate,
        value:
          values.investmentStartDate ||
          investmentOpportunityDefaultDetails.investmentSettings[0].value,
      },
      {
        label: reviewDetailsCopy.investmentSettings.scheduleStart,
        value:
          values.scheduleInvestmentStart === 'no'
            ? reviewDetailsCopy.investmentSettings.no
            : reviewDetailsCopy.investmentSettings.yes,
      },
    ],
    operator: {
      ...investmentOpportunityDefaultDetails.operator,
      nameAr:
        values.developerNameAr || investmentOpportunityDefaultDetails.operator.nameAr,
      nameEn:
        values.developerNameEn || investmentOpportunityDefaultDetails.operator.nameEn,
      description:
        values.developerDescriptionAr ||
        values.developerDescriptionEn ||
        investmentOpportunityDefaultDetails.operator.description,
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
  const { t, i18n } = useTranslation(['navigation', 'validation'])
  const { dir } = useDirection()
  const addCopy = t('investmentOpportunity.add', {
    ns: 'navigation',
    returnObjects: true,
  })
  const reviewDetailsCopy = t('investmentOpportunity.reviewDetails', {
    ns: 'navigation',
    returnObjects: true,
  })
  const locationSeparator = i18n.resolvedLanguage === 'ar' ? '، ' : ', '
  const [reviewOpen, setReviewOpen] = useState(false)
  const [isNeighborhoodMapOpen, setIsNeighborhoodMapOpen] = useState(false)
  const [selectedCityIdForMap, setSelectedCityIdForMap] = useState('')
  const [reviewDetails, setReviewDetails] = useState(
    investmentOpportunityDefaultDetails,
  )
  const { data: cities = [] } = useCitiesQuery()
  const createOpportunityMutation = useCreateOpportunityMutation()
  const createDraftMutation = useCreateOpportunityDraftMutation()
  const {
    register,
    getValues,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: INVESTMENT_OPPORTUNITY_FORM_DEFAULT_VALUES,
  })
  const { fileFields, fileUploadState, getManagedFilesSnapshot } =
    useInvestmentOpportunityFileUploadState({
      register,
      setValue,
      clearErrors,
    })

  const propertyPrice = watch('propertyPrice')
  const shareCount = watch('shareCount')
  const propertyImagePreviewUrls =
    fileUploadState.propertyImages?.imagePreviewUrls ?? []

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        value: city.id,
        label: i18n.resolvedLanguage === 'en' ? city.name_en : city.name_ar,
      })),
    [cities, i18n.resolvedLanguage],
  )

  useEffect(() => {
    const parsedPrice = parseNumber(propertyPrice)
    const parsedShareCount = parseNumber(shareCount)

    if (parsedPrice === null || parsedShareCount === null || parsedShareCount <= 0) {
      if (String(getValues('sharePrice') ?? '').trim()) {
        setValue('sharePrice', '', {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      return
    }

    const computedSharePrice = (parsedPrice / parsedShareCount).toFixed(2)
    if (computedSharePrice === String(getValues('sharePrice') ?? '').trim()) {
      return
    }

    setValue('sharePrice', computedSharePrice, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [getValues, propertyPrice, setValue, shareCount])

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

  const applySchemaIssues = (issues = []) => {
    const handledFields = new Set()

    issues.forEach((issue) => {
      const fieldName = issue.path?.[0]
      if (typeof fieldName !== 'string' || handledFields.has(fieldName)) {
        return
      }

      handledFields.add(fieldName)
      setError(fieldName, {
        type: 'manual',
        message: issue.message || t('required', { ns: 'validation' }),
      })
    })
  }

  const validateFormValues = (mode, values) => {
    const schema =
      mode === 'draft'
        ? createInvestmentOpportunityDraftSchema(t)
        : createInvestmentOpportunityPublishSchema(t)
    const result = schema.safeParse(values)

    if (result.success) {
      return true
    }

    applySchemaIssues(result.error.issues)
    return false
  }

  const handleContinue = (event) => {
    event.preventDefault()
    clearErrors()

    const formValues = buildSubmissionValues(
      getValues(),
      getManagedFilesSnapshot(),
    )
    if (!validateFormValues('publish', formValues)) {
      return
    }

    const cityName =
      cityOptions.find((cityOption) => cityOption.value === formValues.cityId)
        ?.label ?? ''
    setReviewDetails(
      buildReviewDetails(
        formValues,
        cityName,
        propertyImagePreviewUrls,
        reviewDetailsCopy,
        locationSeparator,
      ),
    )
    setReviewOpen(true)
  }

  const handleSaveDraft = async () => {
    clearErrors()
    const formValues = buildSubmissionValues(
      getValues(),
      getManagedFilesSnapshot(),
    )
    if (!validateFormValues('draft', formValues)) {
      return
    }

    try {
      const formData = buildOpportunityFormData(formValues, {
        mode: 'draft',
      })
      await createDraftMutation.mutateAsync(formData)
      showDashboardSuccessToast(addCopy.toasts.draftSuccess)
      navigateToList()
    } catch (error) {
      showDashboardErrorToast({
        title: addCopy.toasts.draftError.title,
        description: resolveApiErrorMessage(error, t),
        actionLabel: addCopy.toasts.draftError.actionLabel,
      })
    }
  }

  const handlePublish = async () => {
    clearErrors()
    const formValues = buildSubmissionValues(
      getValues(),
      getManagedFilesSnapshot(),
    )
    if (!validateFormValues('publish', formValues)) {
      setReviewOpen(false)
      return
    }

    try {
      const formData = buildOpportunityFormData(formValues, {
        mode: 'publish',
      })
      await createOpportunityMutation.mutateAsync(formData)
      setReviewOpen(false)
      showDashboardSuccessToast(addCopy.toasts.publishSuccess)
      navigateToList()
    } catch (error) {
      showDashboardErrorToast({
        title: addCopy.toasts.publishError.title,
        description: resolveApiErrorMessage(error, t),
        actionLabel: addCopy.toasts.publishError.actionLabel,
      })
    }
  }

  const handleOpenLocationPicker = () => {
    const currentCityId = String(getValues('cityId') ?? '').trim()
    const nextCityId = currentCityId || cityOptions[0]?.value || ''

    setSelectedCityIdForMap(nextCityId)
    setIsNeighborhoodMapOpen(true)
  }

  function handleConfirmNeighborhoodSelection(selection) {
    if (!selection) {
      return
    }

    const resolvedCityId =
      String(selection.cityId ?? '').trim() || String(getValues('cityId') ?? '').trim()
    if (resolvedCityId) {
      setValue('cityId', resolvedCityId, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
    setValue('neighborhood', selection.neighborhood, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setValue('latitude', String(selection.latitude), {
      shouldValidate: true,
      shouldDirty: true,
    })
    setValue('longitude', String(selection.longitude), {
      shouldValidate: true,
      shouldDirty: true,
    })
    setValue('propertyLocation', selection.locationText, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setSelectedCityIdForMap(resolvedCityId)
    clearErrors([
      'cityId',
      'neighborhood',
      'propertyLocation',
      'latitude',
      'longitude',
    ])
  }

  return (
    <div className="pb-8 text-start" dir={dir}>
      <InvestmentOpportunityForm
        breadcrumbCurrent={addCopy.breadcrumbCurrent}
        title={addCopy.title}
        description={addCopy.description}
        register={register}
        fileFields={fileFields}
        fileUploadState={fileUploadState}
        errors={errors}
        onSubmit={handleContinue}
        submitLabel={addCopy.submitLabel}
        draftLabel={addCopy.draftLabel}
        onDraft={handleSaveDraft}
        cancelLabel={addCopy.cancelLabel}
        isSubmitting={isSubmitting}
        cityOptions={cityOptions}
        showCityNeighborhoodFields={false}
        showCurrencyField={false}
        propertyLocationReadOnly
        sharePriceReadOnly
        onOpenLocationPicker={handleOpenLocationPicker}
        showReferenceCode={false}
        onCancel={navigateToList}
      />
      <InvestmentOpportunityNeighborhoodMapDialog
        open={isNeighborhoodMapOpen}
        onOpenChange={setIsNeighborhoodMapOpen}
        cities={cities}
        selectedCityId={selectedCityIdForMap}
        onSelectedCityIdChange={setSelectedCityIdForMap}
        locale={i18n.resolvedLanguage}
        onConfirm={handleConfirmNeighborhoodSelection}
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
