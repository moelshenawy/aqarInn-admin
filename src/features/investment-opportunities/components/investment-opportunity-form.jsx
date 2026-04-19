import { Calendar, MapPin } from 'lucide-react'

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

const PROPERTY_TYPE_OPTIONS = [
  { value: 'residential', label: 'سكني' },
  { value: 'commercial', label: 'تجاري' },
]

const YES_NO_OPTIONS = [
  { value: 'yes', label: 'نعم' },
  { value: 'no', label: 'لا' },
]

const RETURN_FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'شهرية' },
  { value: 'quarterly', label: 'ربع سنوية' },
  { value: 'semi_annual', label: 'نصف سنوية' },
  { value: 'annual', label: 'سنوية' },
]

const INVESTMENT_DURATION_OPTIONS = [
  { value: '6', label: '6 أشهر' },
  { value: '12', label: '1 سنة' },
  { value: '24', label: '2 سنة' },
  { value: '36', label: '3 سنوات' },
]

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
  return (
    <form className="px-0 sm:px-4 lg:px-[26px]" onSubmit={onSubmit} noValidate>
      <header className="mb-10 space-y-[19px]">
        <nav
          className="flex flex-wrap items-center justify-start gap-2 text-sm leading-5 font-semibold"
          aria-label="مسار الصفحة"
        >
          <span className="text-[#6d4f3b]">الفرص الاستثمارية</span>
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
              label="الكود المرجعي"
              placeholder="قم بإدخال الكود المرجعي للفرصة"
              required
              error={errors.referenceCode?.message}
              {...register('referenceCode')}
            />
          ) : null}
          <InvestmentOpportunityTextField
            id="titleAr"
            label="العنوان بالعربية"
            placeholder="قم بإدخال العنوان بالعربية"
            required
            error={errors.titleAr?.message}
            {...register('titleAr')}
          />
          <InvestmentOpportunityTextField
            id="titleEn"
            label="العنوان بالإنجليزية"
            placeholder="قم بإدخال العنوان بالإنجليزية"
            required
            error={errors.titleEn?.message}
            {...register('titleEn')}
          />
          {showCityNeighborhoodFields ? (
            <>
              <InvestmentOpportunitySelectField
                id="cityId"
                label="المدينة"
                placeholder="اختر المدينة"
                options={cityOptions}
                required
                error={errors.cityId?.message}
                {...register('cityId')}
              />
              <InvestmentOpportunityTextField
                id="neighborhood"
                label="الحي"
                placeholder="يتم تحديد الحي من الخريطة"
                required
                readOnly
                error={errors.neighborhood?.message}
                {...register('neighborhood')}
              />
            </>
          ) : null}
        </InvestmentOpportunityFormGrid>

        <InvestmentOpportunityFormSection title="تفاصيل العقار">
          <InvestmentOpportunityFormGrid>
            <InvestmentOpportunitySelectField
              id="propertyType"
              label="نوع العقار"
              placeholder="اختر نوع العقار"
              options={PROPERTY_TYPE_OPTIONS}
              required
              error={errors.propertyType?.message}
              {...register('propertyType')}
            />
            <InvestmentOpportunityTextField
              id="propertyArea"
              label="مساحة العقار (م²)"
              placeholder="قم بإدخال مساحة العقار"
              inputMode="decimal"
              required
              error={errors.propertyArea?.message}
              {...register('propertyArea')}
            />
            <InvestmentOpportunityTextField
              id="floorCount"
              label="عدد الأدوار"
              placeholder="قم بإدخال عدد الأدوار"
              inputMode="numeric"
              error={errors.floorCount?.message}
              {...register('floorCount')}
            />
            <InvestmentOpportunityTextField
              id="buildYear"
              label="سنة البناء"
              placeholder="قم بإدخال سنة البناء"
              inputMode="numeric"
              error={errors.buildYear?.message}
              {...register('buildYear')}
            />
            <InvestmentOpportunityTextField
              id="propertyLocation"
              label="موقع العقار"
              placeholder="قم بتحديد موقع العقار"
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
              label="المستندات المتاحة"
              placeholder="أضف المستندات المتاحة للعقار"
              accept=".pdf,.png,.jpg,.jpeg"
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
              onCloseFilesModal={
                fileUploadState.propertyDocuments?.onCloseFilesModal
              }
              onOpenFilePreview={
                fileUploadState.propertyDocuments?.onOpenFilePreview
              }
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
              label="صور العقار"
              accept="image/png,image/jpeg"
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
              label="صورة 360"
              placeholder="ارفع صورة 360 (اختياري)"
              accept="image/png,image/jpeg"
              error={errors.virtualTour?.message}
              selectedFiles={fileUploadState.virtualTour?.files}
              isLoading={fileUploadState.virtualTour?.isLoading}
              onRemoveFile={fileUploadState.virtualTour?.onRemoveFile}
              {...(fileFields.virtualTour ?? register('virtualTour'))}
            />
          </InvestmentOpportunityFormGrid>
        </InvestmentOpportunityFormSection>

        <InvestmentOpportunityFormSection title="تفاصيل المشغل">
          <InvestmentOpportunityFormGrid>
            <InvestmentOpportunityTextField
              id="developerNameAr"
              label="اسم المطوّر بالعربية"
              placeholder="قم بإدخال اسم المطوّر بالعربية"
              required
              error={errors.developerNameAr?.message}
              {...register('developerNameAr')}
            />
            <InvestmentOpportunityTextField
              id="developerNameEn"
              label="اسم المطوّر بالإنجليزية"
              placeholder="قم بإدخال اسم المطوّر بالإنجليزية"
              required
              error={errors.developerNameEn?.message}
              {...register('developerNameEn')}
            />
            <InvestmentOpportunityTextareaField
              id="developerDescriptionAr"
              label="وصف المطوّر بالعربية"
              placeholder="قم بإدخال وصف بالعربية"
              error={errors.developerDescriptionAr?.message}
              {...register('developerDescriptionAr')}
            />
            <InvestmentOpportunityTextareaField
              id="developerDescriptionEn"
              label="وصف المطوّر بالإنجليزية"
              placeholder="قم بإدخال وصف بالإنجليزية"
              error={errors.developerDescriptionEn?.message}
              {...register('developerDescriptionEn')}
            />
            <InvestmentOpportunityTextField
              id="developerEmail"
              label="البريد الإلكتروني"
              placeholder="قم بإدخال البريد الإلكتروني"
              type="email"
              required
              error={errors.developerEmail?.message}
              {...register('developerEmail')}
            />
            <InvestmentOpportunityFilePickerField
              id="developerLogo"
              label="الشعار"
              placeholder="قم برفع شعار المطوّر"
              accept="image/svg+xml,image/png,image/jpeg"
              error={errors.developerLogo?.message}
              selectedFiles={fileUploadState.developerLogo?.files}
              isLoading={fileUploadState.developerLogo?.isLoading}
              onRemoveFile={fileUploadState.developerLogo?.onRemoveFile}
              {...(fileFields.developerLogo ?? register('developerLogo'))}
            />
            <InvestmentOpportunityTextField
              id="developerPhone"
              label="رقم الجوال"
              placeholder="قم بإدخال رقم الجوال"
              addon="+966"
              inputMode="numeric"
              required
              error={errors.developerPhone?.message}
              {...register('developerPhone')}
            />
            <InvestmentOpportunityTextField
              id="developerLocation"
              label="موقع المطوّر"
              placeholder="قم بتحديد موقع المطوّر"
              icon={MapPin}
              error={errors.developerLocation?.message}
              {...register('developerLocation')}
            />
          </InvestmentOpportunityFormGrid>
        </InvestmentOpportunityFormSection>

        <InvestmentOpportunityFormSection title="المعلومات المالية">
          <InvestmentOpportunityFormGrid>
            <InvestmentOpportunityTextField
              id="propertyPrice"
              label="سعر العقار"
              placeholder="قم بإدخال السعر الإجمالي"
              addon={<RiyalIcon className="text-xl" />}
              inputMode="decimal"
              required
              error={errors.propertyPrice?.message}
              {...register('propertyPrice')}
            />
            {showCurrencyField ? (
              <InvestmentOpportunityTextField
                id="currency"
                label="العملة"
                placeholder="رمز العملة"
                required
                error={errors.currency?.message}
                {...register('currency')}
              />
            ) : null}
            <InvestmentOpportunityTextField
              id="shareCount"
              label="عدد الحصص"
              placeholder="قم بإدخال عدد الحصص"
              inputMode="numeric"
              required
              error={errors.shareCount?.message}
              {...register('shareCount')}
            />
            <InvestmentOpportunityTextField
              id="sharePrice"
              label="سعر الحصة"
              placeholder="قم بإدخال سعر الحصة"
              addon={<RiyalIcon className="text-xl" />}
              inputMode="decimal"
              required
              readOnly={sharePriceReadOnly}
              error={errors.sharePrice?.message}
              {...register('sharePrice')}
            />
            <InvestmentOpportunityTextField
              id="minInvestmentShares"
              label="الحد الأدنى للحصص"
              placeholder="أدخل الحد الأدنى للحصص"
              inputMode="numeric"
              required
              error={errors.minInvestmentShares?.message}
              {...register('minInvestmentShares')}
            />
            <InvestmentOpportunityTextField
              id="maxSharesPerUser"
              label="الحد الأعلى للحصص لكل مستخدم"
              placeholder="أدخل الحد الأعلى للحصص"
              inputMode="numeric"
              required
              error={errors.maxSharesPerUser?.message}
              {...register('maxSharesPerUser')}
            />
            <InvestmentOpportunityTextField
              id="maxUserOwnershipPct"
              label="نسبة الملكية القصوى (%)"
              placeholder="أدخل النسبة المئوية"
              addon="%"
              inputMode="decimal"
              required
              error={errors.maxUserOwnershipPct?.message}
              {...register('maxUserOwnershipPct')}
            />
            <InvestmentOpportunityTextField
              id="expectedNetReturn"
              label="العائد الصافي المتوقع"
              placeholder="قم بإدخال قيمة العائد الصافي"
              addon={<RiyalIcon className="text-xl" />}
              inputMode="decimal"
              required
              error={errors.expectedNetReturn?.message}
              {...register('expectedNetReturn')}
            />
            <InvestmentOpportunityTextField
              id="expectedReturn"
              label="العائد المتوقع (%)"
              placeholder="قم بإدخال نسبة العائد المتوقعة"
              addon="%"
              inputMode="decimal"
              required
              error={errors.expectedReturn?.message}
              {...register('expectedReturn')}
            />
            <InvestmentOpportunitySelectField
              id="returnFrequency"
              label="دورية العائد"
              placeholder="اختر دورية توزيع العائد"
              options={RETURN_FREQUENCY_OPTIONS}
              required
              error={errors.returnFrequency?.message}
              {...register('returnFrequency')}
            />
            <InvestmentOpportunitySelectField
              id="investmentDurationMonths"
              label="مدة الاستثمار"
              placeholder="اختر مدة الاستثمار"
              options={INVESTMENT_DURATION_OPTIONS}
              required
              error={errors.investmentDurationMonths?.message}
              {...register('investmentDurationMonths')}
            />
          </InvestmentOpportunityFormGrid>
        </InvestmentOpportunityFormSection>

        <InvestmentOpportunityFormSection title="اعدادات الاستثمار">
          <InvestmentOpportunityFormGrid>
            <InvestmentOpportunitySelectField
              id="scheduleInvestmentStart"
              label="جدولة بداية الاستثمار"
              placeholder="هل تريد جدولة بداية الاستثمار؟"
              options={YES_NO_OPTIONS}
              {...register('scheduleInvestmentStart')}
            />
            <InvestmentOpportunityTextField
              id="investmentStartDate"
              label="تاريخ بداية الاستثمار"
              placeholder="قم بتحديد تاريخ بداية الاستثمار"
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
