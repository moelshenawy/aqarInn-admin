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
    title:
      values.titleAr ||
      values.titleEn ||
      investmentOpportunityDefaultDetails.title,
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
  const { t, i18n } = useTranslation(['validation'])
  const [reviewOpen, setReviewOpen] = useState(false)
  const [isNeighborhoodMapOpen, setIsNeighborhoodMapOpen] = useState(false)
  const [selectedCityIdForMap, setSelectedCityIdForMap] = useState('')
  const [reviewDetails, setReviewDetails] = useState(
    investmentOpportunityDefaultDetails,
  )
  const [uploadingFields, setUploadingFields] = useState({})
  const [managedFiles, setManagedFiles] = useState(() => ({
    propertyDocuments: [],
    propertyImages: [],
    virtualTour: [],
    developerLogo: [],
  }))
  const [propertyImagePreviewUrls, setPropertyImagePreviewUrls] = useState([])
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

  const propertyPrice = watch('propertyPrice')
  const shareCount = watch('shareCount')

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

  useEffect(() => {
    const files = normalizeFiles(managedFiles.propertyImages)

    if (!files.length) {
      setPropertyImagePreviewUrls([])
      return
    }

    const nextPreviewUrls = files.map((file) => URL.createObjectURL(file))
    setPropertyImagePreviewUrls(nextPreviewUrls)

    return () => {
      nextPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [managedFiles.propertyImages])

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

  const setManagedFilesForField = (fieldName, files) => {
    const normalizedFiles = normalizeFiles(files)

    setManagedFiles((current) => ({
      ...current,
      [fieldName]: normalizedFiles,
    }))
    setValue(fieldName, normalizedFiles, {
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
        setManagedFilesForField(fieldName, nextFiles)
        event.target.value = ''
      },
    }
  }

  const removeSelectedFile = (fieldName, index) => {
    const nextFiles = normalizeFiles(managedFiles[fieldName]).filter(
      (_, fileIndex) => fileIndex !== index,
    )

    setManagedFilesForField(fieldName, nextFiles)

    if (fileInputRefs.current[fieldName]) {
      fileInputRefs.current[fieldName].value = ''
    }
  }

  const fileUploadState = {
    propertyDocuments: {
      files: managedFiles.propertyDocuments,
      isLoading: Boolean(uploadingFields.propertyDocuments),
      onRemoveFile: (index) => removeSelectedFile('propertyDocuments', index),
    },
    propertyImages: {
      files: managedFiles.propertyImages,
      isLoading: Boolean(uploadingFields.propertyImages),
      onRemoveFile: (index) => removeSelectedFile('propertyImages', index),
    },
    virtualTour: {
      files: managedFiles.virtualTour,
      isLoading: Boolean(uploadingFields.virtualTour),
      onRemoveFile: (index) => removeSelectedFile('virtualTour', index),
    },
    developerLogo: {
      files: managedFiles.developerLogo,
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

    const formValues = getValues()
    if (!validateFormValues('publish', formValues)) {
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
    clearErrors()
    const formValues = getValues()
    if (!validateFormValues('draft', formValues)) {
      return
    }

    try {
      const formData = buildOpportunityFormData(formValues, {
        mode: 'draft',
      })
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
    clearErrors()
    const formValues = getValues()
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

    setValue('cityId', selection.cityId, {
      shouldValidate: true,
      shouldDirty: true,
    })
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
    setSelectedCityIdForMap(selection.cityId)
    clearErrors([
      'cityId',
      'neighborhood',
      'propertyLocation',
      'latitude',
      'longitude',
    ])
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
