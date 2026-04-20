import { Calendar, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { RiyalIcon } from '@/components/ui/riyal-icon'
import {
  InvestmentOpportunityDropzoneField,
  InvestmentOpportunityFilePickerField,
  InvestmentOpportunityFormActions,
  InvestmentOpportunityFormGrid,
  InvestmentOpportunityFormSection,
  InvestmentOpportunitySelectField,
  InvestmentOpportunityTextareaField,
  InvestmentOpportunityTextField,
} from '@/features/investment-opportunities/components/investment-opportunity-form-controls'
import { useDirection } from '@/lib/i18n/direction-provider'

export function InvestmentOpportunityForm({
  breadcrumbCurrent,
  title,
  description,
  register,
  errors = {},
  onSubmit,
  submitLabel,
  draftLabel,
  onDraft,
  cancelLabel,
  onCancel,
  cityOptions = [],
  isSubmitting = false,
  fileFields = {},
  fileUploadState = {},
  showReferenceCode = true,
  showCityNeighborhoodFields = true,
  showCurrencyField = true,
  propertyLocationReadOnly = false,
  sharePriceReadOnly = false,
  onOpenLocationPicker,
}) {
  const { t } = useTranslation('navigation')
  const { dir } = useDirection()
  const formCopy = t('investmentOpportunity.form', { returnObjects: true })

  const propertyTypeOptions = [
    {
      value: 'residential',
      label: formCopy.options.propertyType.residential,
    },
    {
      value: 'commercial',
      label: formCopy.options.propertyType.commercial,
    },
  ]

  const yesNoOptions = [
    { value: 'yes', label: formCopy.options.yesNo.yes },
    { value: 'no', label: formCopy.options.yesNo.no },
  ]

  const returnFrequencyOptions = [
    { value: 'monthly', label: formCopy.options.returnFrequency.monthly },
    { value: 'quarterly', label: formCopy.options.returnFrequency.quarterly },
    {
      value: 'semi_annual',
      label: formCopy.options.returnFrequency.semiAnnual,
    },
    { value: 'annual', label: formCopy.options.returnFrequency.annual },
  ]

  const investmentDurationOptions = [
    { value: '6', label: formCopy.options.investmentDuration['6'] },
    { value: '12', label: formCopy.options.investmentDuration['12'] },
    { value: '24', label: formCopy.options.investmentDuration['24'] },
    { value: '36', label: formCopy.options.investmentDuration['36'] },
  ]

  return (
    <form
      className="px-0 sm:px-4 lg:px-[26px]"
      onSubmit={onSubmit}
      noValidate
      dir={dir}
    >
      <header className="mb-10 space-y-[19px]">
        <nav
          className="flex flex-wrap items-center justify-start gap-2 text-sm leading-5 font-semibold"
          aria-label={formCopy.breadcrumbAria}
        >
          <span className="text-[#6d4f3b]">{t('investmentOpportunities')}</span>
          <span className="text-lg leading-7 text-[#6d4f3b]">/</span>
          <span className="text-[#ac9063]">{breadcrumbCurrent}</span>
        </nav>

        <div className="space-y-3">
          <h1 className="text-[30px] leading-[38px] font-semibold text-[#181927]">
            {title}
          </h1>
          <p className="max-w-[784px] text-lg leading-7 font-medium text-[#717680] sm:me-auto">
            {description}
          </p>
        </div>
      </header>

      <div className="space-y-[30px]">
        <InvestmentOpportunityFormGrid>
          {showReferenceCode ? (
            <InvestmentOpportunityTextField
              id="referenceCode"
              label={formCopy.fields.referenceCode.label}
              placeholder={formCopy.fields.referenceCode.placeholder}
              required
              error={errors.referenceCode?.message}
              {...register('referenceCode')}
            />
          ) : null}
          <InvestmentOpportunityTextField
            id="titleAr"
            label={formCopy.fields.titleAr.label}
            placeholder={formCopy.fields.titleAr.placeholder}
            required
            error={errors.titleAr?.message}
            {...register('titleAr')}
          />
          <InvestmentOpportunityTextField
            id="titleEn"
            label={formCopy.fields.titleEn.label}
            placeholder={formCopy.fields.titleEn.placeholder}
            required
            error={errors.titleEn?.message}
            {...register('titleEn')}
          />
          {showCityNeighborhoodFields ? (
            <>
              <InvestmentOpportunitySelectField
                id="cityId"
                label={formCopy.fields.cityId.label}
                placeholder={formCopy.fields.cityId.placeholder}
                options={cityOptions}
                required
                error={errors.cityId?.message}
                {...register('cityId')}
              />
              <InvestmentOpportunityTextField
                id="neighborhood"
                label={formCopy.fields.neighborhood.label}
                placeholder={formCopy.fields.neighborhood.placeholder}
                required
                readOnly
                error={errors.neighborhood?.message}
                {...register('neighborhood')}
              />
            </>
          ) : null}
        </InvestmentOpportunityFormGrid>

        <InvestmentOpportunityFormSection title={formCopy.sections.propertyDetails}>
          <InvestmentOpportunityFormGrid>
            <InvestmentOpportunitySelectField
              id="propertyType"
              label={formCopy.fields.propertyType.label}
              placeholder={formCopy.fields.propertyType.placeholder}
              options={propertyTypeOptions}
              required
              error={errors.propertyType?.message}
              {...register('propertyType')}
            />
            <InvestmentOpportunityTextField
              id="propertyArea"
              label={formCopy.fields.propertyArea.label}
              placeholder={formCopy.fields.propertyArea.placeholder}
              inputMode="decimal"
              required
              error={errors.propertyArea?.message}
              {...register('propertyArea')}
            />
            <InvestmentOpportunityTextField
              id="floorCount"
              label={formCopy.fields.floorCount.label}
              placeholder={formCopy.fields.floorCount.placeholder}
              inputMode="numeric"
              error={errors.floorCount?.message}
              {...register('floorCount')}
            />
            <InvestmentOpportunityTextField
              id="buildYear"
              label={formCopy.fields.buildYear.label}
              placeholder={formCopy.fields.buildYear.placeholder}
              inputMode="numeric"
              error={errors.buildYear?.message}
              {...register('buildYear')}
            />
            <InvestmentOpportunityTextField
              id="propertyLocation"
              label={formCopy.fields.propertyLocation.label}
              placeholder={formCopy.fields.propertyLocation.placeholder}
              icon={MapPin}
              required
              readOnly={propertyLocationReadOnly}
              inputClassName={
                propertyLocationReadOnly ? 'cursor-pointer' : undefined
              }
              onClick={
                propertyLocationReadOnly
                  ? () => onOpenLocationPicker?.()
                  : undefined
              }
              onKeyDown={
                propertyLocationReadOnly
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onOpenLocationPicker?.()
                      }
                    }
                  : undefined
              }
              error={errors.propertyLocation?.message}
              {...register('propertyLocation')}
            />
            <InvestmentOpportunityFilePickerField
              id="propertyDocuments"
              label={formCopy.fields.propertyDocuments.label}
              placeholder={formCopy.fields.propertyDocuments.placeholder}
              accept=".pdf,.png,.jpg,.jpeg,.webp,.heic,.heif"
              multiple
              required
              error={errors.propertyDocuments?.message}
              selectedFiles={fileUploadState.propertyDocuments?.files}
              isLoading={fileUploadState.propertyDocuments?.isLoading}
              onRemoveFile={fileUploadState.propertyDocuments?.onRemoveFile}
              enableFilesModal
              previewItems={fileUploadState.propertyDocuments?.previewItems}
              selectedPreviewItem={
                fileUploadState.propertyDocuments?.selectedPreviewItem
              }
              isFilesModalOpen={
                fileUploadState.propertyDocuments?.isFilesModalOpen
              }
              isPreviewModalOpen={
                fileUploadState.propertyDocuments?.isPreviewModalOpen
              }
              onOpenFilesModal={fileUploadState.propertyDocuments?.onOpenFilesModal}
              onCloseFilesModal={fileUploadState.propertyDocuments?.onCloseFilesModal}
              onOpenFilePreview={fileUploadState.propertyDocuments?.onOpenFilePreview}
              onClosePreviewModal={
                fileUploadState.propertyDocuments?.onClosePreviewModal
              }
              onBackToFilesModal={
                fileUploadState.propertyDocuments?.onBackToFilesModal
              }
              onUploadMore={fileUploadState.propertyDocuments?.onUploadMore}
              {...(fileFields.propertyDocuments ??
                register('propertyDocuments'))}
            />
            <InvestmentOpportunityDropzoneField
              id="propertyImages"
              label={formCopy.fields.propertyImages.label}
              accept="image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif"
              multiple
              required
              error={errors.propertyImages?.message}
              selectedFiles={fileUploadState.propertyImages?.files}
              imagePreviewUrls={fileUploadState.propertyImages?.imagePreviewUrls}
              isLoading={fileUploadState.propertyImages?.isLoading}
              onRemoveFile={fileUploadState.propertyImages?.onRemoveFile}
              {...(fileFields.propertyImages ?? register('propertyImages'))}
            />
            <InvestmentOpportunityFilePickerField
              id="virtualTour"
              label={formCopy.fields.virtualTour.label}
              placeholder={formCopy.fields.virtualTour.placeholder}
              accept="image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif"
              error={errors.virtualTour?.message}
              selectedFiles={fileUploadState.virtualTour?.files}
              isLoading={fileUploadState.virtualTour?.isLoading}
              onRemoveFile={fileUploadState.virtualTour?.onRemoveFile}
              {...(fileFields.virtualTour ?? register('virtualTour'))}
            />
          </InvestmentOpportunityFormGrid>
        </InvestmentOpportunityFormSection>

        <InvestmentOpportunityFormSection title={formCopy.sections.operatorDetails}>
          <InvestmentOpportunityFormGrid>
            <InvestmentOpportunityTextField
              id="developerNameAr"
              label={formCopy.fields.developerNameAr.label}
              placeholder={formCopy.fields.developerNameAr.placeholder}
              required
              error={errors.developerNameAr?.message}
              {...register('developerNameAr')}
            />
            <InvestmentOpportunityTextField
              id="developerNameEn"
              label={formCopy.fields.developerNameEn.label}
              placeholder={formCopy.fields.developerNameEn.placeholder}
              required
              error={errors.developerNameEn?.message}
              {...register('developerNameEn')}
            />
            <InvestmentOpportunityTextareaField
              id="developerDescriptionAr"
              label={formCopy.fields.developerDescriptionAr.label}
              placeholder={formCopy.fields.developerDescriptionAr.placeholder}
              error={errors.developerDescriptionAr?.message}
              {...register('developerDescriptionAr')}
            />
            <InvestmentOpportunityTextareaField
              id="developerDescriptionEn"
              label={formCopy.fields.developerDescriptionEn.label}
              placeholder={formCopy.fields.developerDescriptionEn.placeholder}
              error={errors.developerDescriptionEn?.message}
              {...register('developerDescriptionEn')}
            />
            <InvestmentOpportunityTextField
              id="developerEmail"
              label={formCopy.fields.developerEmail.label}
              placeholder={formCopy.fields.developerEmail.placeholder}
              type="email"
              required
              error={errors.developerEmail?.message}
              {...register('developerEmail')}
            />
            <InvestmentOpportunityFilePickerField
              id="developerLogo"
              label={formCopy.fields.developerLogo.label}
              placeholder={formCopy.fields.developerLogo.placeholder}
              accept="image/svg+xml,image/png,image/jpeg"
              error={errors.developerLogo?.message}
              selectedFiles={fileUploadState.developerLogo?.files}
              isLoading={fileUploadState.developerLogo?.isLoading}
              onRemoveFile={fileUploadState.developerLogo?.onRemoveFile}
              {...(fileFields.developerLogo ?? register('developerLogo'))}
            />
            <InvestmentOpportunityTextField
              id="developerPhone"
              label={formCopy.fields.developerPhone.label}
              placeholder={formCopy.fields.developerPhone.placeholder}
              addon="+966"
              inputMode="numeric"
              required
              error={errors.developerPhone?.message}
              {...register('developerPhone')}
            />
            <InvestmentOpportunityTextField
              id="developerLocation"
              label={formCopy.fields.developerLocation.label}
              placeholder={formCopy.fields.developerLocation.placeholder}
              icon={MapPin}
              error={errors.developerLocation?.message}
              {...register('developerLocation')}
            />
          </InvestmentOpportunityFormGrid>
        </InvestmentOpportunityFormSection>

        <InvestmentOpportunityFormSection title={formCopy.sections.financialInfo}>
          <InvestmentOpportunityFormGrid>
            <InvestmentOpportunityTextField
              id="propertyPrice"
              label={formCopy.fields.propertyPrice.label}
              placeholder={formCopy.fields.propertyPrice.placeholder}
              addon={<RiyalIcon className="text-xl" />}
              inputMode="decimal"
              required
              error={errors.propertyPrice?.message}
              {...register('propertyPrice')}
            />
            {showCurrencyField ? (
              <InvestmentOpportunityTextField
                id="currency"
                label={formCopy.fields.currency.label}
                placeholder={formCopy.fields.currency.placeholder}
                required
                error={errors.currency?.message}
                {...register('currency')}
              />
            ) : null}
            <InvestmentOpportunityTextField
              id="shareCount"
              label={formCopy.fields.shareCount.label}
              placeholder={formCopy.fields.shareCount.placeholder}
              inputMode="numeric"
              required
              error={errors.shareCount?.message}
              {...register('shareCount')}
            />
            <InvestmentOpportunityTextField
              id="sharePrice"
              label={formCopy.fields.sharePrice.label}
              placeholder={formCopy.fields.sharePrice.placeholder}
              addon={<RiyalIcon className="text-xl" />}
              inputMode="decimal"
              required
              readOnly={sharePriceReadOnly}
              error={errors.sharePrice?.message}
              {...register('sharePrice')}
            />
            <InvestmentOpportunityTextField
              id="minInvestmentShares"
              label={formCopy.fields.minInvestmentShares.label}
              placeholder={formCopy.fields.minInvestmentShares.placeholder}
              inputMode="numeric"
              required
              error={errors.minInvestmentShares?.message}
              {...register('minInvestmentShares')}
            />
            <InvestmentOpportunityTextField
              id="maxSharesPerUser"
              label={formCopy.fields.maxSharesPerUser.label}
              placeholder={formCopy.fields.maxSharesPerUser.placeholder}
              inputMode="numeric"
              required
              error={errors.maxSharesPerUser?.message}
              {...register('maxSharesPerUser')}
            />
            <InvestmentOpportunityTextField
              id="maxUserOwnershipPct"
              label={formCopy.fields.maxUserOwnershipPct.label}
              placeholder={formCopy.fields.maxUserOwnershipPct.placeholder}
              addon="%"
              inputMode="decimal"
              required
              error={errors.maxUserOwnershipPct?.message}
              {...register('maxUserOwnershipPct')}
            />
            <InvestmentOpportunityTextField
              id="expectedNetReturn"
              label={formCopy.fields.expectedNetReturn.label}
              placeholder={formCopy.fields.expectedNetReturn.placeholder}
              addon={<RiyalIcon className="text-xl" />}
              inputMode="decimal"
              required
              error={errors.expectedNetReturn?.message}
              {...register('expectedNetReturn')}
            />
            <InvestmentOpportunityTextField
              id="expectedReturn"
              label={formCopy.fields.expectedReturn.label}
              placeholder={formCopy.fields.expectedReturn.placeholder}
              addon="%"
              inputMode="decimal"
              required
              error={errors.expectedReturn?.message}
              {...register('expectedReturn')}
            />
            <InvestmentOpportunitySelectField
              id="returnFrequency"
              label={formCopy.fields.returnFrequency.label}
              placeholder={formCopy.fields.returnFrequency.placeholder}
              options={returnFrequencyOptions}
              required
              error={errors.returnFrequency?.message}
              {...register('returnFrequency')}
            />
            <InvestmentOpportunitySelectField
              id="investmentDurationMonths"
              label={formCopy.fields.investmentDurationMonths.label}
              placeholder={formCopy.fields.investmentDurationMonths.placeholder}
              options={investmentDurationOptions}
              required
              error={errors.investmentDurationMonths?.message}
              {...register('investmentDurationMonths')}
            />
          </InvestmentOpportunityFormGrid>
        </InvestmentOpportunityFormSection>

        <InvestmentOpportunityFormSection title={formCopy.sections.investmentSettings}>
          <InvestmentOpportunityFormGrid>
            <InvestmentOpportunitySelectField
              id="scheduleInvestmentStart"
              label={formCopy.fields.scheduleInvestmentStart.label}
              placeholder={formCopy.fields.scheduleInvestmentStart.placeholder}
              options={yesNoOptions}
              {...register('scheduleInvestmentStart')}
            />
            <InvestmentOpportunityTextField
              id="investmentStartDate"
              label={formCopy.fields.investmentStartDate.label}
              placeholder={formCopy.fields.investmentStartDate.placeholder}
              type="date"
              onClick={(event) => {
                event.currentTarget.showPicker?.()
              }}
              icon={Calendar}
              error={errors.investmentStartDate?.message}
              {...register('investmentStartDate')}
            />
          </InvestmentOpportunityFormGrid>
        </InvestmentOpportunityFormSection>
      </div>

      <InvestmentOpportunityFormActions
        submitLabel={submitLabel}
        draftLabel={draftLabel}
        onDraft={onDraft}
        cancelLabel={cancelLabel}
        onCancel={onCancel}
        disableSubmit={isSubmitting}
        disableDraft={isSubmitting}
        disableCancel={isSubmitting}
      />
      {!showCityNeighborhoodFields ? (
        <>
          <input type="hidden" {...register('cityId')} />
          <input type="hidden" {...register('neighborhood')} />
        </>
      ) : null}
      {!showCurrencyField ? (
        <input type="hidden" {...register('currency')} />
      ) : null}
      <input type="hidden" {...register('latitude')} />
      <input type="hidden" {...register('longitude')} />
    </form>
  )
}
