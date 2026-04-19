import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { Button } from '@/components/ui/button'
import {
  showDashboardErrorToast,
  showDashboardSuccessToast,
} from '@/components/ui/dashboard-toast'
import i18n from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useCreateUserMutation } from '@/features/users/hooks/use-create-user-mutation'
import { useUpdateUserMutation } from '@/features/users/hooks/use-update-user-mutation'
import { useDirection } from '@/lib/i18n/direction-provider'
import { useOpportunitiesQuery } from '@/features/investment-opportunities/hooks/use-opportunities-query'

function getToastDirection() {
  return i18n.resolvedLanguage === 'ar' ? 'rtl' : 'ltr'
}

const dir = getToastDirection()

const roleOptions = [
  { value: 'superAdmin', label: 'Super Admin المشرف العام' },
  { value: 'operationsAdmin', label: 'Operations Admin مدير العمليات' },
  { value: 'investmentManager', label: 'Investment Manager مدير الاستثمار' },
  { value: 'readOnlyViewer', label: 'Read-Only Viewer مشاهد فقط' },
]

const initialFormValues = {
  code: '',
  fullNameAr: '',
  fullNameEn: '',
  email: '',
  mobile: '',
  roles: [],
  investmentOpportunityIds: [],
  password: '',
  active: true,
}

function asStringArray(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((entry) => typeof entry === 'string' && entry.trim())
}

function getInitialFormValues(prefillValues) {
  if (!prefillValues) {
    return initialFormValues
  }

  const prefillRoles = asStringArray(prefillValues.roles)
  const normalizedRoles =
    prefillRoles.length > 0
      ? prefillRoles
      : prefillValues.role
        ? [prefillValues.role]
        : []

  return {
    ...initialFormValues,
    ...prefillValues,
    code: prefillValues.code ?? '',
    fullNameAr: prefillValues.fullNameAr ?? '',
    fullNameEn: prefillValues.fullNameEn ?? '',
    email: prefillValues.email ?? '',
    mobile: prefillValues.mobile ?? '',
    roles: normalizedRoles,
    investmentOpportunityIds: asStringArray(
      prefillValues.investmentOpportunityIds,
    ),
    password: '',
    active:
      typeof prefillValues.active === 'boolean'
        ? prefillValues.active
        : initialFormValues.active,
  }
}

function UsersAddFieldShell({ id, label, children, className }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col items-start gap-3 text-start',
        className,
      )}
    >
      <label
        htmlFor={id}
        className="inline-flex items-start justify-end gap-0.5 text-start text-sm leading-5 font-medium text-[#402f28]"
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
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-required="true"
        dir={dir}
        className="h-[50px] w-full rounded-lg border border-[#bfab85] bg-[#f8f3e8] px-3.5 py-3.5 text-start text-sm leading-5 font-medium text-[#402f28] shadow-[var(--dashboard-shadow)] outline-none placeholder:text-[#bfab85] focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20"
      />
    </UsersAddFieldShell>
  )
}

function normalizeSaudiMobile(rawValue) {
  const digits = String(rawValue ?? '').replace(/\D/g, '')
  if (!digits) return null

  if (digits.startsWith('966')) {
    const localNine = digits.slice(3)
    if (localNine.length === 9 && localNine.startsWith('5')) {
      return `0${localNine}`
    }

    return digits
  }

  if (digits.length === 10 && digits.startsWith('05')) {
    return digits
  }

  if (digits.length === 9 && digits.startsWith('5')) {
    return `0${digits}`
  }

  return digits
}

function toggleSelection(items, nextItem) {
  if (items.includes(nextItem)) {
    return items.filter((item) => item !== nextItem)
  }

  return [...items, nextItem]
}

function UsersAddMultiSelectField({
  id,
  label,
  values,
  onChange,
  options,
  placeholder,
}) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const selectedOptions = options.filter((option) =>
    values.includes(option.value),
  )
  const summaryText =
    selectedOptions.length > 0
      ? selectedOptions.map((option) => option.label).join(' • ')
      : placeholder

  return (
    <UsersAddFieldShell id={id} label={label}>
      <div ref={wrapperRef} className="relative w-full">
        <button
          id={id}
          type="button"
          aria-required="true"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="flex h-[50px] w-full items-center justify-end rounded-lg border border-[#bfab85] bg-[#f8f3e8] py-3.5 pr-3.5 pl-11 text-start text-sm leading-5 font-medium shadow-[var(--dashboard-shadow)] transition outline-none focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20"
        >
          <span
            className={cn(
              'line-clamp-1 min-w-0 flex-1 text-start',
              selectedOptions.length > 0 ? 'text-[#402f28]' : 'text-[#bfab85]',
            )}
          >
            {summaryText}
          </span>
          <ChevronDown
            className={cn(
              'pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 stroke-[1.8] text-[#9d7e55] transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>

        {open ? (
          <div
            role="listbox"
            aria-multiselectable="true"
            className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-lg border border-[#d6cbb2] bg-[#f8f3e8] p-1 shadow-[0_12px_24px_rgba(10,13,18,0.08)]"
          >
            {options.map((option) => {
              const isSelected = values.includes(option.value)

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() =>
                    onChange(toggleSelection(values, option.value))
                  }
                  className="flex w-full items-center justify-end gap-2 rounded-md px-3 py-2 text-start text-sm leading-5 text-[#402f28] transition hover:bg-[#eae5d7] focus-visible:bg-[#eae5d7] focus-visible:outline-none"
                >
                  <span className="min-w-0 flex-1">{option.label}</span>
                  <span
                    className={cn(
                      'flex size-4 items-center justify-center rounded-[4px] border transition',
                      isSelected
                        ? 'border-[#402f28] bg-[#402f28] text-white'
                        : 'border-[#d6cbb2] bg-transparent text-transparent',
                    )}
                  >
                    <Check className="size-3 stroke-[2.2]" aria-hidden="true" />
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </UsersAddFieldShell>
  )
}

function UsersAddInvestmentOpportunitiesField({
  id,
  values,
  onChange,
  options,
  isLoading,
}) {
  return (
    <UsersAddFieldShell
      id={id}
      label="قائمة الفرص الاستثمارية"
      className="md:col-span-2"
    >
      <div
        id={id}
        className="w-full rounded-lg border border-[#bfab85] bg-[#f8f3e8] p-3 shadow-[var(--dashboard-shadow)]"
      >
        {isLoading ? (
          <p className="text-sm leading-5 text-[#9d7e55]">
            جارٍ تحميل الفرص الاستثمارية...
          </p>
        ) : options.length === 0 ? (
          <p className="text-sm leading-5 text-[#9d7e55]">
            لا توجد فرص استثمارية منشورة متاحة حالياً.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {options.map((option) => {
              const isChecked = values.includes(option.value)

              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-end gap-2 rounded-md px-2 py-1.5 transition hover:bg-[#eae5d7]"
                >
                  <span className="min-w-0 flex-1 text-sm leading-5 font-medium text-[#402f28]">
                    {option.label}
                  </span>
                  <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        onChange(toggleSelection(values, option.value))
                      }
                      className="peer sr-only"
                    />
                    <span className="pointer-events-none size-5 rounded-[6px] border border-[#d6cbb2] bg-transparent transition peer-checked:border-[#402f28] peer-checked:bg-[#402f28]" />
                    <Check className="pointer-events-none absolute size-3 text-white opacity-0 transition peer-checked:opacity-100" />
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </div>
    </UsersAddFieldShell>
  )
}

function UsersAddStatusField({ active, onChange }) {
  return (
    <UsersAddFieldShell id="user-status" label="الحالة">
      <label
        htmlFor="user-status"
        className="flex h-[50px] w-full cursor-pointer items-center justify-end gap-2 rounded-lg border border-[#bfab85] bg-[#f8f3e8] p-3.5 text-start text-sm leading-5 font-medium text-[#bfab85] shadow-[var(--dashboard-shadow)] transition focus-within:border-[#9d7e55] focus-within:ring-3 focus-within:ring-[#9d7e55]/20"
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
  const location = useLocation()
  const prefillValues = location.state?.userFormPrefill
  const userId = location.state?.userId
  const isEditMode = location.state?.mode === 'edit' && Boolean(userId)
  const [formValues, setFormValues] = useState(() =>
    getInitialFormValues(prefillValues),
  )
  const { i18n } = useTranslation()
  const createUserMutation = useCreateUserMutation()
  const updateUserMutation = useUpdateUserMutation()

  const isInvestmentManagerSelected =
    formValues.roles.includes('investmentManager')

  const { data: opportunitiesPayload, isLoading: isLoadingOpportunities } =
    useOpportunitiesQuery(1, '', {
      enabled: isInvestmentManagerSelected,
    })

  const publishedOpportunityOptions = useMemo(() => {
    const opportunities = Array.isArray(opportunitiesPayload?.data)
      ? opportunitiesPayload.data
      : []

    return opportunities
      .filter((opportunity) => opportunity?.status === 'published')
      .map((opportunity) => {
        const localizedTitle = opportunity?.title

        return {
          value: String(opportunity?.id ?? ''),
          label: `${opportunity?.reference_code ?? opportunity?.id} - ${localizedTitle ?? ''}`,
        }
      })
      .filter((option) => option.value.trim())
  }, [i18n.resolvedLanguage, opportunitiesPayload])

  const isSubmitting =
    Boolean(createUserMutation.isLoading ?? createUserMutation.isPending) ||
    Boolean(updateUserMutation.isLoading ?? updateUserMutation.isPending)

  function updateField(field, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  function navigateToUsers() {
    navigate(ROUTE_PATHS.withLocale(ROUTE_PATHS.users, i18n.resolvedLanguage))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const selectedRoles = asStringArray(formValues.roles)
    const payload = {
      full_name_ar: formValues.fullNameAr.trim(),
      full_name_en: formValues.fullNameEn.trim(),
      email: formValues.email.trim(),
      mobile_number: normalizeSaudiMobile(formValues.mobile),
      status: formValues.active ? 'active' : 'inactive',
      role: selectedRoles[0] ?? '',
      roles: selectedRoles,
    }

    if (
      !payload.full_name_ar ||
      !payload.full_name_en ||
      !payload.email ||
      !payload.mobile_number ||
      payload.roles.length === 0
    ) {
      showDashboardErrorToast({
        title: 'بيانات غير مكتملة',
        description:
          'يرجى إدخال الاسمين العربي والإنجليزي والبريد الإلكتروني ورقم الجوال والدور الوظيفي.',
      })
      return
    }

    if (
      selectedRoles.includes('investmentManager') &&
      formValues.investmentOpportunityIds.length === 0
    ) {
      showDashboardErrorToast({
        title: 'بيانات غير مكتملة',
        description:
          'يرجى تحديد فرصة استثمارية واحدة على الأقل عند اختيار دور مدير الاستثمار.',
      })
      return
    }

    if (isEditMode) {
      updateUserMutation.mutate(
        { userId, payload },
        {
          onSuccess: () => {
            showDashboardSuccessToast({
              title: 'تم تعديل المستخدم بنجاح',
              description:
                'تم حفظ بيانات المستخدم المحدثة بنجاح، ويمكنك متابعة صلاحياته من قائمة المستخدمين.',
              actionLabel: 'إغلاق',
            })
            navigateToUsers()
          },
          onError: (error) => {
            showDashboardErrorToast({
              title: 'فشل التعديل',
              description:
                error?.message ?? 'تعذر تحديث بيانات المستخدم. حاول مرة أخرى.',
            })
          },
        },
      )
      return
    }

    const password = formValues.password.trim()

    if (!password) {
      showDashboardErrorToast({
        title: 'بيانات غير مكتملة',
        description: 'يرجى إدخال كلمة المرور للمستخدم الجديد.',
      })
      return
    }

    createUserMutation.mutate(
      { ...payload, password },
      {
        onSuccess: () => {
          showDashboardSuccessToast({
            title: 'تم إضافة المستخدم بنجاح',
            description:
              'تمت إضافة المستخدم إلى النظام بنجاح، ويمكنك الآن إدارة صلاحياته ومتابعة نشاطه.',
            actionLabel: 'إغلاق',
          })
          navigateToUsers()
        },
        onError: (error) => {
          showDashboardErrorToast({
            title: 'فشل الإضافة',
            description:
              error?.message ?? 'تعذر إضافة المستخدم. حاول مرة أخرى.',
          })
        },
      },
    )
  }

  const { dir } = useDirection()

  return (
    <div
      className="-mt-[31px] flex flex-col items-start gap-[60px] px-[26px] py-5 pb-8 text-start"
      dir={dir}
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
              <span className="text-[#6d4f3b]">المستخدمين</span>
              <span className="text-lg leading-7 text-[#6d4f3b]">/</span>

              <span className="text-[#ac9063]">
                {isEditMode ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
              </span>
            </nav>

            <div className="flex w-full flex-col items-start gap-3">
              <h1 className="w-full text-start text-[30px] leading-[38px] font-semibold text-[#181927]">
                {isEditMode ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
              </h1>
              <p className="w-full text-start text-lg leading-7 font-medium text-[#717680]">
                {isEditMode
                  ? 'قم بتحديث بيانات المستخدم ثم احفظ التعديلات.'
                  : 'قم بإكمال الحقول المطلوبة لإضافة مستخدم جديد إلى النظام'}
              </p>
            </div>
          </header>

          <div className="grid w-full grid-cols-1 gap-[30px] md:grid-cols-2 md:gap-x-4">
            {/* <UsersAddTextField
              id="user-code"
              label="الكود"
              value={formValues.code}
              onChange={(value) => updateField('code', value)}
              placeholder="أدخل كود المستخدم مثل ADM-001"
            /> */}
            <UsersAddMultiSelectField
              id="user-role"
              label="الدور الوظيفي"
              values={formValues.roles}
              onChange={(value) => updateField('roles', value)}
              options={roleOptions}
              placeholder="اختر الدور الوظيفي"
            />
            {isInvestmentManagerSelected ? (
              <UsersAddInvestmentOpportunitiesField
                id="user-investment-opportunities"
                values={formValues.investmentOpportunityIds}
                onChange={(value) =>
                  updateField('investmentOpportunityIds', value)
                }
                options={publishedOpportunityOptions}
                isLoading={isLoadingOpportunities}
              />
            ) : null}
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
              onChange={(value) =>
                updateField('mobile', value.replace(/[^\d+]/g, '').slice(0, 13))
              }
              placeholder="أدخل رقم الجوال"
              type="text"
              inputMode="numeric"
            />
            <UsersAddTextField
              id="user-email"
              label="البريد الإلكتروني"
              value={formValues.email}
              onChange={(value) => updateField('email', value)}
              placeholder="أدخل بريدًا إلكترونيًا فعالًا"
              type="email"
            />
            {!isEditMode ? (
              <UsersAddTextField
                id="user-password"
                label="كلمة المرور"
                value={formValues.password}
                onChange={(value) => updateField('password', value)}
                placeholder="أدخل كلمة المرور"
                type="password"
              />
            ) : null}
            <UsersAddStatusField
              active={formValues.active}
              onChange={(value) => updateField('active', value)}
            />
          </div>
        </div>

        <div
          className="flex h-[47px] w-full items-start gap-2.5"
          dir={i18n.resolvedLanguage === 'ar' ? 'rtl' : 'ltr'}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-[47px] w-[176px] rounded-lg border-2 border-white/10 bg-[#402f28] px-3.5 py-2.5 text-sm leading-5 font-semibold text-white shadow-[var(--dashboard-shadow)] hover:bg-[#4c382f] focus-visible:ring-[#9d7e55]/25"
          >
            {isEditMode ? 'حفظ التعديلات' : 'إضافة المستخدم'}
          </Button>
          <Button
            type="button"
            onClick={navigateToUsers}
            className="h-[47px] w-[163px] rounded-lg bg-[#eae5d7] px-3.5 py-2.5 text-sm leading-5 font-semibold text-[#402f28] shadow-[var(--dashboard-shadow)] hover:bg-[#ded6c4] focus-visible:ring-[#9d7e55]/25"
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  )
}

