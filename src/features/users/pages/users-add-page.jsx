import { useState } from 'react'
import { ChevronDown, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { Button } from '@/components/ui/button'
import { showDashboardSuccessToast } from '@/components/ui/dashboard-toast'
import { cn } from '@/lib/utils'

const addUserSuccessToast = {
  title: 'تم اضافة المستخدم بنجاح',
  description:
    'تمت إضافة المستخدم إلى النظام بنجاح، ويمكنك الآن إدارة صلاحياته ومتابعة نشاطه',
  actionLabel: 'اغلاق',
}

const initialFormValues = {
  fullNameAr: '',
  fullNameEn: '',
  email: '',
  mobile: '',
  role: '',
  active: false,
  investmentOpportunity: '',
}

const roleOptions = [
  { value: 'operations-manager', label: 'مدير العمليات' },
  { value: 'customer-service-manager', label: 'مدير خدمة العملاء' },
  { value: 'investment-analyst', label: 'محلل استثمار عقاري' },
]

const investmentOpportunityOptions = [
  {
    value: 'investment-riyadh-001',
    label: 'مجمع سكني حديث في شمال الرياض',
  },
  {
    value: 'investment-jeddah-023',
    label: 'وحدات فندقية في جدة',
  },
]

function UsersAddFieldShell({ id, label, children, className }) {
  return (
    <div className={cn('flex min-w-0 flex-col items-end gap-3', className)}>
      <label
        htmlFor={id}
        className="inline-flex items-start justify-end gap-0.5 text-right text-sm leading-5 font-medium text-[#402f28]"
      >
        <span className="text-[#876647]">*</span>
        <span>{label}</span>
      </label>
      {children}
    </div>
  )
}

function UsersAddTextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
}) {
  return (
    <UsersAddFieldShell id={id} label={label}>
      <div className="relative w-full">
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-required="true"
          dir="rtl"
          className="h-[50px] w-full rounded-lg border border-[#bfab85] bg-[#f8f3e8] py-3.5 pr-3.5 pl-11 text-right text-sm leading-5 font-medium text-[#402f28] shadow-[var(--dashboard-shadow)] outline-none placeholder:text-[#bfab85] focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20"
        />
        <EyeOff
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 stroke-[1.8] text-[#bfab85]"
          aria-hidden="true"
        />
      </div>
    </UsersAddFieldShell>
  )
}

function UsersAddSelectField({
  id,
  label,
  value,
  onChange,
  placeholder,
  options,
  className,
}) {
  return (
    <UsersAddFieldShell id={id} label={label} className={className}>
      <div className="relative w-full">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-required="true"
          dir="rtl"
          className="h-[50px] w-full appearance-none rounded-lg border border-[#bfab85] bg-[#f8f3e8] py-3.5 pr-3.5 pl-11 text-right text-sm leading-5 font-medium text-[#bfab85] shadow-[var(--dashboard-shadow)] outline-none focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 stroke-[1.8] text-[#9d7e55]"
          aria-hidden="true"
        />
      </div>
    </UsersAddFieldShell>
  )
}

function UsersAddStatusField({ active, onChange }) {
  return (
    <UsersAddFieldShell id="user-status" label="الحالة">
      <label
        htmlFor="user-status"
        className="flex h-[50px] w-full cursor-pointer items-center justify-end gap-2 rounded-lg border border-[#bfab85] bg-[#f8f3e8] p-3.5 text-right text-sm leading-5 font-medium text-[#bfab85] shadow-[var(--dashboard-shadow)] transition focus-within:border-[#9d7e55] focus-within:ring-3 focus-within:ring-[#9d7e55]/20"
      >
        <span className="min-w-0 flex-1 truncate">
          {active ? 'نشط' : 'غير نشط'}
        </span>
        <span className="relative inline-flex h-4 w-8 shrink-0 items-center rounded-full bg-[#eae5d7]">
          <input
            id="user-status"
            type="checkbox"
            checked={active}
            onChange={(event) => onChange(event.target.checked)}
            className="peer sr-only"
          />
          <span className="size-4 rounded-full border border-[#d6cbb2] bg-[#d6cbb2] shadow-[var(--dashboard-shadow)] transition peer-checked:-translate-x-4 peer-checked:border-[#402f28] peer-checked:bg-[#402f28]" />
        </span>
      </label>
    </UsersAddFieldShell>
  )
}

export default function UsersAddPage() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState(initialFormValues)
  const { i18n } = useTranslation()

  function updateField(field, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    showDashboardSuccessToast(addUserSuccessToast)
    navigate(ROUTE_PATHS.withLocale(ROUTE_PATHS.users, i18n.resolvedLanguage))
  }

  return (
    <div
      className="-mt-[31px] flex flex-col items-start gap-[60px] px-[26px] py-5 pb-8 text-start"
      dir="rtl"
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-start gap-[60px]"
      >
        <div className="flex w-full flex-col items-end gap-10">
          <header className="flex w-full flex-col items-end gap-[19px] text-start">
            <nav
              aria-label="مسار الصفحة"
              className="flex w-full items-start justify-start gap-2 text-sm leading-5 font-semibold whitespace-nowrap"
            >
              <span className="text-[#ac9063]">إضافة مستخدم جديد</span>
              <span className="text-lg leading-7 text-[#6d4f3b]">/</span>
              <span className="text-[#6d4f3b]">المستخدمين</span>
            </nav>

            <div className="flex w-full flex-col items-start gap-3">
              <h1 className="w-full text-right text-[30px] leading-[38px] font-semibold text-[#181927]">
                إضافة مستخدم جديد
              </h1>
              <p className="w-full text-right text-lg leading-7 font-medium text-[#717680]">
                قم بإكمال الحقول المطلوبة لإضافة مستخدم جديد إلى النظام
              </p>
            </div>
          </header>

          <div className="grid w-full grid-cols-1 gap-[30px] md:grid-cols-2 md:gap-x-4">
            <UsersAddTextField
              id="user-full-name-en"
              label="الاسم الكامل بالإنجليزية"
              value={formValues.fullNameEn}
              onChange={(value) => updateField('fullNameEn', value)}
              placeholder="اكتب الاسم الكامل باللغة الإنجليزية"
            />
            <UsersAddTextField
              id="user-full-name-ar"
              label="الاسم الكامل بالعربية"
              value={formValues.fullNameAr}
              onChange={(value) => updateField('fullNameAr', value)}
              placeholder="أدخل الاسم الرباعي باللغة العربية"
            />
            <UsersAddTextField
              id="user-mobile"
              label="رقم الجوال"
              value={formValues.mobile}
              onChange={(value) => updateField('mobile', value)}
              placeholder="أدخل رقم الجوال بصيغة سعودية"
              type="tel"
              inputMode="tel"
            />
            <UsersAddTextField
              id="user-email"
              label="البريد الإلكتروني"
              value={formValues.email}
              onChange={(value) => updateField('email', value)}
              placeholder="أدخل بريدًا إلكترونيًا فعالًا"
              type="email"
            />
            <UsersAddSelectField
              id="user-role"
              label="الدور"
              value={formValues.role}
              onChange={(value) => updateField('role', value)}
              placeholder="حدد دور أو أكثر يحدد صلاحيات المستخدم داخل النظام"
              options={roleOptions}
            />
            <UsersAddStatusField
              active={formValues.active}
              onChange={(value) => updateField('active', value)}
            />
            <UsersAddSelectField
              id="user-investment-opportunity"
              label="قائمة الفرص الاستثمارية"
              value={formValues.investmentOpportunity}
              onChange={(value) => updateField('investmentOpportunity', value)}
              placeholder="اختر الفرص الاستثمارية"
              options={investmentOpportunityOptions}
              className="md:col-span-2"
            />
          </div>
        </div>

        <div className="flex h-[47px] w-full items-start gap-2.5" dir="ltr">
          <Button
            type="submit"
            className="h-[47px] w-[176px] rounded-lg border-2 border-white/10 bg-[#402f28] px-3.5 py-2.5 text-sm leading-5 font-semibold text-white shadow-[var(--dashboard-shadow)] hover:bg-[#4c382f] focus-visible:ring-[#9d7e55]/25"
          >
            اضافة المستخدم
          </Button>
          <Button
            type="button"
            onClick={() =>
              navigate(
                ROUTE_PATHS.withLocale(
                  ROUTE_PATHS.users,
                  i18n.resolvedLanguage,
                ),
              )
            }
            className="h-[47px] w-[163px] rounded-lg bg-[#eae5d7] px-3.5 py-2.5 text-sm leading-5 font-semibold text-[#402f28] shadow-[var(--dashboard-shadow)] hover:bg-[#ded6c4] focus-visible:ring-[#9d7e55]/25"
          >
            الغاء
          </Button>
        </div>
      </form>
    </div>
  )
}
