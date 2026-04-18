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
import { useUserQuery } from '@/features/users/hooks/use-user-query'

function getToastDirection() {
  return i18n.resolvedLanguage === 'ar' ? 'rtl' : 'ltr'
}

const dir = getToastDirection()

const addUserSuccessToast = {
  title: 'تم إضافة المستخدم بنجاح',
  description:
    'تمت إضافة المستخدم إلى النظام بنجاح، ويمكنك الآن إدارة صلاحياته ومتابعة نشاطه.',
  actionLabel: 'إغلاق',
}

const roleOptions = [
  { value: 'super-admin', label: 'Super Admin المشرف العام' },
  { value: 'operation-admin', label: 'Operation Admin مدير العمليات' },
  { value: 'investment-manager', label: 'Investment Manager مدير استثمار' },
  { value: 'read-only-viewer', label: 'Read-Only Viewer مشاهد فقط' },
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

const initialFormValues = {
  fullNameAr: '',
  fullNameEn: '',
  email: '',
  mobile: '',
  roles: [],
  active: true,
  investmentOpportunities: [],
}

function normalizeMultiSelectInput(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string' && value.length > 0) {
    return [value]
  }

  return []
}

function getInitialFormValues(prefillValues) {
  if (!prefillValues) {
    return initialFormValues
  }

  return {
    ...initialFormValues,
    ...prefillValues,
    roles: normalizeMultiSelectInput(prefillValues.roles ?? prefillValues.role),
    investmentOpportunities: normalizeMultiSelectInput(
      prefillValues.investmentOpportunities ??
        prefillValues.investmentOpportunity,
    ),
    active: Boolean(prefillValues.active),
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

function generateSystemPassword(length = 10) {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower = 'abcdefghijkmnopqrstuvwxyz'
  const digits = '23456789'
  const symbols = '@#$%&*!?'
  const all = upper + lower + digits + symbols
  const pick = (chars) => chars[Math.floor(Math.random() * chars.length)]

  const passwordChars = [pick(upper), pick(digits), pick(symbols)]

  while (passwordChars.length < length) {
    passwordChars.push(pick(all))
  }

  for (let i = passwordChars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]]
  }

  return passwordChars.join('')
}

function normalizeSaudiMobile(rawValue) {
  const digits = String(rawValue ?? '').replace(/\D/g, '')
  if (!digits) return null

  if (digits.startsWith('966')) {
    const localNine = digits.slice(3)
    if (localNine.length === 9 && localNine.startsWith('5')) {
      return `0${localNine}`
    }
  }

  if (digits.length === 10 && digits.startsWith('05')) {
    return digits
  }

  if (digits.length === 9 && digits.startsWith('5')) {
    return `0${digits}`
  }

  return null
}

function UsersAddMultiSelectField({
  id,
  label,
  values,
  onChange,
  options,
  placeholder,
  className,
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

  const selectedLabels = useMemo(
    () =>
      options
        .filter((option) => values.includes(option.value))
        .map((option) => option.label),
    [options, values],
  )

  const summaryText =
    selectedLabels.length > 0 ? selectedLabels.join('، ') : placeholder

  function toggleValue(nextValue) {
    if (values.includes(nextValue)) {
      onChange(values.filter((value) => value !== nextValue))
      return
    }

    onChange([...values, nextValue])
  }

  return (
    <UsersAddFieldShell id={id} label={label} className={className}>
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
              selectedLabels.length > 0 ? 'text-[#402f28]' : 'text-[#bfab85]',
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
                  onClick={() => toggleValue(option.value)}
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
  const { data: userDetails } = useUserQuery(userId, isEditMode)

  const isSubmitting =
    Boolean(createUserMutation.isLoading ?? createUserMutation.isPending) ||
    Boolean(updateUserMutation.isLoading ?? updateUserMutation.isPending)

  function updateField(field, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  useEffect(() => {
    if (!isEditMode || !userDetails?.data) {
      return
    }

    const user = userDetails.data
    setFormValues((currentValues) => ({
      ...currentValues,
      fullNameAr: user.full_name ?? currentValues.fullNameAr,
      fullNameEn: user.full_name ?? currentValues.fullNameEn,
      email: user.email ?? currentValues.email,
      mobile: user.mobile_number ?? currentValues.mobile,
      active: (user.account_status ?? 'active') === 'active',
    }))
  }, [isEditMode, userDetails])

  function handleSubmit(event) {
    event.preventDefault()

    const fullName =
      formValues.fullNameAr.trim() || formValues.fullNameEn.trim()
    const email = formValues.email.trim()
    const saudiMobile = normalizeSaudiMobile(formValues.mobile)

    if (!fullName || !email || !saudiMobile) {
      showDashboardErrorToast({
        title: 'بيانات غير مكتملة',
        description:
          'يرجى إدخال الاسم والبريد الإلكتروني ورقم جوال سعودي صحيح (05xxxxxxxx أو +9665xxxxxxxx).',
      })
      return
    }

    if (isEditMode) {
      updateUserMutation.mutate(
        {
          userId,
          payload: {
            full_name: fullName,
            email,
            mobile_number: saudiMobile,
            city_id: null,
            account_status: formValues.active ? 'active' : 'inactive',
          },
        },
        {
          onSuccess: () => {
            showDashboardSuccessToast({
              title: 'تم تعديل المستخدم بنجاح',
              description:
                'تم حفظ بيانات المستخدم المحدثة بنجاح، ويمكنك متابعة صلاحياته من قائمة المستخدمين.',
              actionLabel: 'إغلاق',
            })
            navigate(
              ROUTE_PATHS.withLocale(ROUTE_PATHS.users, i18n.resolvedLanguage),
            )
          },
          onError: () => {
            showDashboardErrorToast({
              title: 'فشل التعديل',
              description: 'تعذر تحديث بيانات المستخدم. حاول مرة أخرى.',
            })
          },
        },
      )
      return
    }

    const nationalId = saudiMobile.replace(/^0/, '').padStart(10, '0')
    const password = generateSystemPassword(10)

    createUserMutation.mutate(
      {
        national_id: nationalId,
        full_name: fullName,
        email,
        mobile_number: saudiMobile,
        city_id: null,
        password,
      },
      {
        onSuccess: () => {
          showDashboardSuccessToast({
            ...addUserSuccessToast,
            description:
              'تمت إضافة المستخدم إلى النظام بنجاح، وتم توليد كلمة مرور تلقائية.',
          })
          navigate(
            ROUTE_PATHS.withLocale(ROUTE_PATHS.users, i18n.resolvedLanguage),
          )
        },
        onError: () => {
          showDashboardErrorToast({
            title: 'فشل الإضافة',
            description: 'تعذر إضافة المستخدم. حاول مرة أخرى.',
          })
        },
      },
    )
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
              <span className="text-[#ac9063]">
                {isEditMode ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
              </span>
              <span className="text-lg leading-7 text-[#6d4f3b]">/</span>
              <span className="text-[#6d4f3b]">المستخدمين</span>
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
              placeholder="أدخل رقم الجوال بصيغة سعودية"
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
            <UsersAddMultiSelectField
              id="user-role"
              label="الدور"
              values={formValues.roles}
              onChange={(value) => updateField('roles', value)}
              options={roleOptions}
              placeholder="حدد دور أو أكثر يحدد صلاحيات المستخدم داخل النظام"
            />
            <UsersAddStatusField
              active={formValues.active}
              onChange={(value) => updateField('active', value)}
            />
            <UsersAddMultiSelectField
              id="user-investment-opportunity"
              label="قائمة الفرص الاستثمارية"
              values={formValues.investmentOpportunities}
              onChange={(value) =>
                updateField('investmentOpportunities', value)
              }
              options={investmentOpportunityOptions}
              placeholder="اختر الفرص الاستثمارية"
              className="md:col-span-2"
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
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  )
}
