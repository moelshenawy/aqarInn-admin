import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
import {
  createInvestmentOpportunityDraftSchema,
  createInvestmentOpportunityPublishSchema,
} from '@/features/investment-opportunities/schemas/investment-opportunity-form-schema'
import { buildOpportunityFormData } from '@/features/investment-opportunities/services/build-opportunity-form-data'
import {
  investmentOpportunityDefaultDetails,
  investmentOpportunityGalleryTileClassNames,
} from '@/features/investment-opportunities/constants/investment-opportunity-details-ui'

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

function normalizeFiles(value) {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (typeof FileList !== 'undefined' && value instanceof FileList) {
    return Array.from(value)
  }

  return []
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

function buildReviewDetails(values, cityName, previewUrls = []) {
  return {
    ...investmentOpportunityDefaultDetails,
    titleAr: values.titleAr || investmentOpportunityDefaultDetails.titleAr,
    titleEn: values.titleEn || investmentOpportunityDefaultDetails.titleEn,
    propertyType:
      values.propertyType === 'commercial'
        ? '\u0639\u0642\u0627\u0631 \u062A\u062C\u0627\u0631\u064A'
        : '\u0639\u0642\u0627\u0631 \u0633\u0643\u0646\u064A',
    floors: values.floorCount
      ? `${values.floorCount} \u0623\u062F\u0648\u0627\u0631`
      : investmentOpportunityDefaultDetails.floors,
    totalArea: values.propertyArea
      ? `${values.propertyArea} \u0645\u00B2 \u0645\u0633\u0627\u062D\u0629 \u0625\u062C\u0645\u0627\u0644\u064A\u0629`
      : investmentOpportunityDefaultDetails.totalArea,
    buildYear: values.buildYear || investmentOpportunityDefaultDetails.buildYear,
    locationDisplay:
      [values.neighborhood, cityName].filter(Boolean).join('\u060C ') ||
      values.propertyLocation ||
      investmentOpportunityDefaultDetails.locationDisplay,
    location:
      [values.neighborhood, cityName].filter(Boolean).join('\u060C ') ||
      values.propertyLocation ||
      investmentOpportunityDefaultDetails.location,
    metrics: [
      {
        label:
          '\u0627\u0644\u0639\u0627\u0626\u062F \u0627\u0644\u0635\u0627\u0641\u064A \u0627\u0644\u0645\u062A\u0648\u0642\u0639',
        value:
          values.expectedNetReturn ||
          investmentOpportunityDefaultDetails.metrics[0].value,
      },
      {
        label: '\u0627\u0644\u0639\u0627\u0626\u062F \u0627\u0644\u0645\u062A\u0648\u0642\u0639',
        value:
          values.expectedReturn || investmentOpportunityDefaultDetails.metrics[1].value,
      },
      {
        label: '\u0639\u062F\u062F \u0627\u0644\u062D\u0635\u0635',
        value: values.shareCount || investmentOpportunityDefaultDetails.metrics[2].value,
      },
      {
        label: '\u0633\u0639\u0631 \u0627\u0644\u062D\u0635\u0629',
        value: values.sharePrice || investmentOpportunityDefaultDetails.metrics[3].value,
      },
      {
        label: '\u0633\u0639\u0631 \u0627\u0644\u0639\u0642\u0627\u0631',
        value:
          values.propertyPrice ||
          investmentOpportunityDefaultDetails.metrics[4].value,
        currency: true,
      },
    ],
    gallery: buildReviewGallery(previewUrls),
    investmentSettings: [
      {
        label:
          '\u062A\u0627\u0631\u064A\u062E \u0628\u062F\u0627\u064A\u0629 \u0627\u0644\u0627\u0633\u062A\u062B\u0645\u0627\u0631',
        value:
          values.investmentStartDate ||
          investmentOpportunityDefaultDetails.investmentSettings[0].value,
      },
      {
        label:
          '\u062C\u062F\u0648\u0644\u0629 \u0628\u062F\u0627\u064A\u0629 \u0627\u0644\u0627\u0633\u062A\u062B\u0645\u0627\u0631',
        value:
          values.scheduleInvestmentStart === 'no'
            ? '\u0644\u0627'
            : '\u0646\u0639\u0645',
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
  const [isNeighborhoodMapOpen, setIsNeighborhoodMapOpen] = useState(false)
  const [selectedCityForMap, setSelectedCityForMap] = useState(null)
  const [reviewDetails, setReviewDetails] = useState(
    investmentOpportunityDefaultDetails,
  )
  const [uploadingFields, setUploadingFields] = useState({})
  const [propertyImagePreviewUrls, setPropertyImagePreviewUrls] = useState([])
  const previousCityIdRef = useRef('')
  const uploadTimeoutsRef = useRef({})
  const fileInputRefs = useRef({})
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

  const selectedCityId = watch('cityId')
  const propertyDocumentsValue = watch('propertyDocuments')
  const propertyImagesValue = watch('propertyImages')
  const virtualTourValue = watch('virtualTour')
  const developerLogoValue = watch('developerLogo')

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

  const cityLookup = useMemo(
    () => new Map(cities.map((city) => [city.id, city])),
    [cities],
  )

  useEffect(() => {
    if (!selectedCityId) {
      previousCityIdRef.current = ''
      return
    }

    if (previousCityIdRef.current === selectedCityId) {
      return
    }

    previousCityIdRef.current = selectedCityId
    const city = cityLookup.get(selectedCityId) ?? null
    setSelectedCityForMap(city)
    setValue('neighborhood', '', { shouldValidate: true, shouldDirty: true })
    setValue('latitude', '', { shouldDirty: true })
    setValue('longitude', '', { shouldDirty: true })
    setIsNeighborhoodMapOpen(true)
  }, [cityLookup, selectedCityId, setValue])

  useEffect(() => {
    const files = normalizeFiles(propertyImagesValue)

    if (!files.length) {
      setPropertyImagePreviewUrls([])
      return
    }

    const nextPreviewUrls = files.map((file) => URL.createObjectURL(file))
    setPropertyImagePreviewUrls(nextPreviewUrls)

    return () => {
      nextPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [propertyImagesValue])

  useEffect(
    () => () => {
      Object.values(uploadTimeoutsRef.current).forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
    },
    [],
  )

  const isSubmitting =
    createOpportunityMutation.isPending || createDraftMutation.isPending

  const setFieldUploading = (fieldName) => {
    window.clearTimeout(uploadTimeoutsRef.current[fieldName])
    setUploadingFields((current) => ({ ...current, [fieldName]: true }))
    uploadTimeoutsRef.current[fieldName] = window.setTimeout(() => {
      setUploadingFields((current) => ({ ...current, [fieldName]: false }))
    }, 450)
  }

  const setManagedFiles = (fieldName, files) => {
    setValue(fieldName, files, {
      shouldDirty: true,
      shouldValidate: true,
    })
    clearErrors(fieldName)
  }

  const registerFileField = (fieldName) => {
    const field = register(fieldName)

    return {
      ...field,
      ref: (element) => {
        field.ref(element)
        fileInputRefs.current[fieldName] = element
      },
      onChange: (event) => {
        const nextFiles = normalizeFiles(event.target.files)
        setFieldUploading(fieldName)
        setManagedFiles(fieldName, nextFiles)
        event.target.value = ''
      },
    }
  }

  const removeSelectedFile = (fieldName, index) => {
    const nextFiles = normalizeFiles(getValues(fieldName)).filter(
      (_, fileIndex) => fileIndex !== index,
    )

    setManagedFiles(fieldName, nextFiles)

    if (fileInputRefs.current[fieldName]) {
      fileInputRefs.current[fieldName].value = ''
    }
  }

  const fileUploadState = {
    propertyDocuments: {
      files: normalizeFiles(propertyDocumentsValue),
      isLoading: Boolean(uploadingFields.propertyDocuments),
      onRemoveFile: (index) => removeSelectedFile('propertyDocuments', index),
    },
    propertyImages: {
      files: normalizeFiles(propertyImagesValue),
      isLoading: Boolean(uploadingFields.propertyImages),
      onRemoveFile: (index) => removeSelectedFile('propertyImages', index),
    },
    virtualTour: {
      files: normalizeFiles(virtualTourValue),
      isLoading: Boolean(uploadingFields.virtualTour),
      onRemoveFile: (index) => removeSelectedFile('virtualTour', index),
    },
    developerLogo: {
      files: normalizeFiles(developerLogoValue),
      isLoading: Boolean(uploadingFields.developerLogo),
      onRemoveFile: (index) => removeSelectedFile('developerLogo', index),
    },
  }

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
    setReviewDetails(
      buildReviewDetails(formValues, cityName, propertyImagePreviewUrls),
    )
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

  function handleOpenNeighborhoodMap() {
    if (!selectedCityId) {
      showDashboardErrorToast({
        title: 'المدينة مطلوبة',
        description: 'اختر المدينة أولاً قبل تحديد الحي من الخريطة.',
        actionLabel: 'إغلاق',
      })
      return
    }

    setSelectedCityForMap(cityLookup.get(selectedCityId) ?? null)
    setIsNeighborhoodMapOpen(true)
  }

  function handleConfirmNeighborhoodSelection(selection) {
    if (!selection) {
      return
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

    const currentLocationText = getValues('propertyLocation')
    if (!String(currentLocationText ?? '').trim()) {
      setValue('propertyLocation', selection.locationText, {
        shouldDirty: true,
      })
    }

    clearErrors(['neighborhood', 'latitude', 'longitude'])
  }

  return (
    <div className="pb-8 text-start" dir="rtl">
      <InvestmentOpportunityForm
        breadcrumbCurrent="إضافة فرصة استثمارية"
        title="إضافة فرصة استثمارية جديدة"
        description={addOpportunityDescription}
        register={register}
        fileFields={{
          propertyDocuments: registerFileField('propertyDocuments'),
          propertyImages: registerFileField('propertyImages'),
          virtualTour: registerFileField('virtualTour'),
          developerLogo: registerFileField('developerLogo'),
        }}
        fileUploadState={fileUploadState}
        errors={errors}
        onSubmit={handleContinue}
        submitLabel="التالي"
        draftLabel="حفظ كمسودة"
        onDraft={handleSaveDraft}
        cancelLabel="الغاء"
        isSubmitting={isSubmitting}
        cityOptions={cityOptions}
        onOpenNeighborhoodMap={handleOpenNeighborhoodMap}
        isNeighborhoodMapDisabled={!selectedCityId}
        onCancel={navigateToList}
      />
      <InvestmentOpportunityNeighborhoodMapDialog
        open={isNeighborhoodMapOpen}
        onOpenChange={setIsNeighborhoodMapOpen}
        city={selectedCityForMap}
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
