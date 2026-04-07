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
  { value: 'monthly', label: 'شهري' },
  { value: 'quarterly', label: 'ربع سنوي' },
  { value: 'yearly', label: 'سنوي' },
]

export function InvestmentOpportunityForm({
  breadcrumbCurrent,
  title,
  description,
  register,
  onSubmit,
  submitLabel,
  cancelLabel,
  onCancel,
}) {
  return (
    <form className="px-0 sm:px-4 lg:px-[26px]" onSubmit={onSubmit} noValidate>
      <header className="mb-10 space-y-[19px]">
        <nav
          className="flex flex-wrap items-center justify-start gap-2 text-sm leading-5 font-semibold"
          aria-label="مسار الصفحة"
        >
          <span className="text-[#ac9063]">{breadcrumbCurrent}</span>
          <span className="text-lg leading-7 text-[#6d4f3b]">/</span>
          <span className="text-[#6d4f3b]">الفرص الاستثمارية</span>
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
          <InvestmentOpportunityTextField
            id="titleAr"
            label="العنوان بالعربية"
            placeholder="قم بإدخال العنوان بالعربية"
            required
            {...register('titleAr')}
          />
          <InvestmentOpportunityTextField
            id="titleEn"
            label="العنوان بالإنجليزية"
            placeholder="قم بإدخال العنوان بالإنجليزية"
            required
            {...register('titleEn')}
          />
        </InvestmentOpportunityFormGrid>

        <InvestmentOpportunityFormSection title="تفاصيل العقار">
          <InvestmentOpportunityFormGrid>
            <InvestmentOpportunitySelectField
              id="propertyType"
              label="نوع العقار"
              placeholder="اختر نوع العقار من القائمة (سكني أو تجاري)"
              options={PROPERTY_TYPE_OPTIONS}
              required
              {...register('propertyType')}
            />
            <InvestmentOpportunityTextField
              id="propertyArea"
              label="مساحة العقار (م²)"
              placeholder="قم بإدخال مساحة العقار بالمتر المربع"
              inputMode="decimal"
              required
              {...register('propertyArea')}
            />
            <InvestmentOpportunityTextField
              id="floorCount"
              label="عدد الأدوار"
              placeholder="قم بإدخال عدد أدوار العقار إن وُجد."
              inputMode="numeric"
              required
              {...register('floorCount')}
            />
            <InvestmentOpportunityTextField
              id="buildYear"
              label="سنة البناء"
              placeholder="قم بإدخال سنة بناء العقار"
              inputMode="numeric"
              required
              {...register('buildYear')}
            />
            <InvestmentOpportunityTextField
              id="propertyLocation"
              label="موقع العقار"
              placeholder="قم بتحديد موقع العقار على الخريطة"
              icon={MapPin}
              required
              {...register('propertyLocation')}
            />
            <InvestmentOpportunityFilePickerField
              id="propertyDocuments"
              label="المستندات المتاحة"
              placeholder="اضف المستندات المتاحة للعقار"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              required
              {...register('propertyDocuments')}
            />
            <InvestmentOpportunityDropzoneField
              id="propertyImages"
              label="صور العقار"
              accept="image/svg+xml,image/png,image/jpeg,image/gif"
              multiple
              {...register('propertyImages')}
            />
          </InvestmentOpportunityFormGrid>
        </InvestmentOpportunityFormSection>

        <InvestmentOpportunityFormSection title="تفاصيل المشغل">
          <InvestmentOpportunityFormGrid>
            <InvestmentOpportunityTextField
              id="developerNameAr"
              label="اسم المطوّر بالعربية"
              placeholder="قم بإدخال اسم المطوّر أو الجهة المالكة بالعربية."
              required
              {...register('developerNameAr')}
            />
            <InvestmentOpportunityTextField
              id="developerNameEn"
              label="اسم المطوّر بالإنجليزية"
              placeholder="اسم المطوّر بالإنجليزية"
              required
              {...register('developerNameEn')}
            />
            <InvestmentOpportunityTextareaField
              id="developerDescriptionAr"
              label="وصف المطوّر بالعربية"
              placeholder="قم بإدخال وصف مختصر للمطوّر أو المشروع بالعربية"
              {...register('developerDescriptionAr')}
            />
            <InvestmentOpportunityTextareaField
              id="developerDescriptionEn"
              label="وصف المطوّر بالإنجليزية"
              placeholder="قم بإدخال وصف مختصر للمطوّر أو المشروع بالإنجليزية"
              {...register('developerDescriptionEn')}
            />
            <InvestmentOpportunityTextField
              id="developerEmail"
              label="البريد الإلكتروني"
              placeholder="قم بإدخال البريد الإلكتروني للتواصل مع المطوّر"
              type="email"
              required
              {...register('developerEmail')}
            />
            <InvestmentOpportunityFilePickerField
              id="developerLogo"
              label="الشعار"
              placeholder="قم برفع شعار المطوّر أو المشروع بصيغة صورة مناسبة."
              accept="image/svg+xml,image/png,image/jpeg"
              {...register('developerLogo')}
            />
            <InvestmentOpportunityTextField
              id="developerPhone"
              label="رقم الجوال"
              placeholder="قم بإدخال رقم الجوال للتواصل"
              addon="+966"
              inputMode="tel"
              required
              {...register('developerPhone')}
            />
            <InvestmentOpportunityTextField
              id="developerLocation"
              label="موقع المطوّر"
              placeholder="قم بتحديد موقع المطوّر أو الجهة المالكة"
              icon={MapPin}
              required
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
              {...register('propertyPrice')}
            />
            <InvestmentOpportunityTextField
              id="shareCount"
              label="عدد الحصص"
              placeholder="قم بإدخال السعر الإجمالي للعقار"
              inputMode="numeric"
              required
              {...register('shareCount')}
            />
            <InvestmentOpportunityTextField
              id="sharePrice"
              label="سعر الحصة"
              placeholder="يتم احتساب سعر الحصة تلقائيًا"
              addon={<RiyalIcon className="text-xl" />}
              inputMode="decimal"
              required
              {...register('sharePrice')}
            />
            <InvestmentOpportunityTextField
              id="expectedNetReturn"
              label="العائد الصافي المتوقع"
              placeholder="قم بإدخال قيمة العائد الصافي"
              addon={<RiyalIcon className="text-xl" />}
              inputMode="decimal"
              required
              {...register('expectedNetReturn')}
            />
            <InvestmentOpportunityTextField
              id="expectedReturn"
              label="العائد المتوقع"
              placeholder="قم بإدخال نسبة العائد المتوقعة"
              addon="%"
              inputMode="decimal"
              required
              {...register('expectedReturn')}
            />
            <InvestmentOpportunitySelectField
              id="returnFrequency"
              label="دورية العائد"
              placeholder="اختر دورية توزيع العائد من القائمة"
              options={RETURN_FREQUENCY_OPTIONS}
              required
              {...register('returnFrequency')}
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
              required
              {...register('scheduleInvestmentStart')}
            />
            <InvestmentOpportunityTextField
              id="investmentStartDate"
              label="تاريخ بداية الاستثمار"
              placeholder="قم بتحديد تاريخ بداية الاستثمار."
              icon={Calendar}
              required
              {...register('investmentStartDate')}
            />
          </InvestmentOpportunityFormGrid>
        </InvestmentOpportunityFormSection>
      </div>

      <InvestmentOpportunityFormActions
        submitLabel={submitLabel}
        cancelLabel={cancelLabel}
        onCancel={onCancel}
      />
    </form>
  )
}
