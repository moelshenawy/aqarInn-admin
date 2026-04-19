import { AlertTriangle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  useBeforeUnload,
  useBlocker,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { buildInvestmentOpportunityDetailsPath } from '@/app/router/route-paths'
import {
  showDashboardErrorToast,
  showDashboardSuccessToast,
} from '@/components/ui/dashboard-toast'
import { InvestmentOpportunityForm } from '@/features/investment-opportunities/components/investment-opportunity-form'
import { InvestmentOpportunityNeighborhoodMapDialog } from '@/features/investment-opportunities/components/investment-opportunity-neighborhood-map-dialog'
import { createInvestmentOpportunityFormValues } from '@/features/investment-opportunities/constants/investment-opportunity-form-values'
import { useCitiesQuery } from '@/features/investment-opportunities/hooks/use-cities-query'
import { useInvestmentOpportunityFileUploadState } from '@/features/investment-opportunities/hooks/use-investment-opportunity-file-upload-state'
import { useOpportunityDetailsQuery } from '@/features/investment-opportunities/hooks/use-opportunity-details-query'
import { useUpdateOpportunityMutation } from '@/features/investment-opportunities/hooks/use-update-opportunity-mutation'
import { buildOpportunityFormData } from '@/features/investment-opportunities/services/build-opportunity-form-data'
import { ConfirmationDialog } from '@/shared/components/confirmation-dialog'

const editOpportunityDescription =
  'يمكنك تعديل بيانات الفرصة الاستثمارية من خلال تحديث الحقول المطلوبة، ثم حفظها ليتم تحديث بياناتها في النظام.'

const editSuccessToast = {
  title: 'تم تعديل الفرصة الاستثمارية بنجاح',
  description: 'تم حفظ التعديلات على بيانات الفرصة الاستثمارية.',
  actionLabel: 'إغلاق',
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

export default function InvestmentOpportunityEditPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation(['validation'])
  const { opportunityId = 'investment-riyadh-001' } = useParams()
  const [isNeighborhoodMapOpen, setIsNeighborhoodMapOpen] = useState(false)
  const [selectedCityIdForMap, setSelectedCityIdForMap] = useState('')
  const { data: cities = [] } = useCitiesQuery()
  const { data: opportunity = null } = useOpportunityDetailsQuery(opportunityId)
  const updateOpportunityMutation = useUpdateOpportunityMutation()
  const allowNavigationRef = useRef(false)

  const defaultValues = useMemo(
    () => createInvestmentOpportunityFormValues(opportunity),
    [opportunity],
  )

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    clearErrors,
    reset,
    formState: { errors, isDirty },
  } = useForm({ defaultValues })
  const { fileFields, fileUploadState, getManagedFilesSnapshot } =
    useInvestmentOpportunityFileUploadState({
      register,
      setValue,
      clearErrors,
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

  const cityLookup = useMemo(
    () => new Map(cities.map((city) => [city.id, city])),
    [cities],
  )
  const allowedCityIds = useMemo(
    () =>
      new Set(
        cities
          .map((city) => String(city.id ?? '').trim())
          .filter(Boolean),
      ),
    [cities],
  )
  const resolvedOpportunityId = opportunity?.id ?? opportunityId
  const detailsPath = buildInvestmentOpportunityDetailsPath(
    resolvedOpportunityId,
    i18n.resolvedLanguage,
  )

  useEffect(() => {
    reset(defaultValues)
    setSelectedCityIdForMap(defaultValues.cityId || '')
    allowNavigationRef.current = false
  }, [defaultValues, reset])

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

  const handleValidSave = useCallback(
    async (values) => {
      try {
        const submissionValues = buildSubmissionValues(
          values,
          getManagedFilesSnapshot(),
        )
        const formData = buildOpportunityFormData(submissionValues, {
          mode: 'publish',
          allowedCityIds,
        })
        await updateOpportunityMutation.mutateAsync({
          opportunityId: resolvedOpportunityId,
          formData,
        })

        allowNavigationRef.current = true
        reset(submissionValues)
        showDashboardSuccessToast(editSuccessToast)
        navigate(detailsPath)
      } catch (error) {
        showDashboardErrorToast({
          title: 'Failed to update investment opportunity',
          description: resolveApiErrorMessage(error, t),
          actionLabel: 'Close',
        })
      }
    },
    [
      allowedCityIds,
      detailsPath,
      getManagedFilesSnapshot,
      navigate,
      reset,
      resolvedOpportunityId,
      t,
      updateOpportunityMutation,
    ],
  )

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

  const handleOpenLocationPicker = () => {
    const currentCityId = String(getValues('cityId') ?? '').trim()
    const nextCityId = currentCityId || cityOptions[0]?.value || ''

    setSelectedCityIdForMap(nextCityId)
    setIsNeighborhoodMapOpen(true)
  }

  const handleConfirmNeighborhoodSelection = (selection) => {
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
    <div className="pb-8 text-start" dir="rtl">
      <InvestmentOpportunityForm
        breadcrumbCurrent="تعديل الفرصة الاستثمارية"
        title="تعديل الفرصة الاستثمارية"
        description={editOpportunityDescription}
        register={register}
        fileFields={fileFields}
        fileUploadState={fileUploadState}
        errors={errors}
        cityOptions={cityOptions}
        isSubmitting={updateOpportunityMutation.isPending}
        showReferenceCode={false}
        showCityNeighborhoodFields={false}
        showCurrencyField={false}
        propertyLocationReadOnly
        sharePriceReadOnly
        onOpenLocationPicker={handleOpenLocationPicker}
        onSubmit={handleSave}
        submitLabel="حفظ التعديلات"
        cancelLabel="الغاء"
        onCancel={() => navigate(detailsPath)}
      />
      <InvestmentOpportunityNeighborhoodMapDialog
        open={isNeighborhoodMapOpen}
        onOpenChange={setIsNeighborhoodMapOpen}
        cities={cities}
        selectedCityId={selectedCityIdForMap}
        onSelectedCityIdChange={setSelectedCityIdForMap}
        city={cityLookup.get(selectedCityIdForMap) ?? null}
        locale={i18n.resolvedLanguage}
        onConfirm={handleConfirmNeighborhoodSelection}
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
