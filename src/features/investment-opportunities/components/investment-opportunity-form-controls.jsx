import { forwardRef } from 'react'
import { ChevronUp, UploadCloud } from 'lucide-react'

import { cn } from '@/lib/utils'

function InvestmentOpportunityFieldShell({
  id,
  label,
  required = false,
  className,
  error,
  children,
}) {
  return (
    <div className={cn('space-y-3 text-start', className)}>
      <label
        htmlFor={id}
        dir="rtl"
        className="inline-flex items-start gap-0.5 text-sm leading-5 font-medium text-[#402f28]"
      >
        <span>{label}</span>
        {required ? <span className="text-[#876647]">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs leading-5 font-medium text-[#b93815]">{error}</p>
      ) : null}
    </div>
  )
}

function InvestmentOpportunityFieldAddon({ children, icon: Icon }) {
  const hasAddon =
    children !== undefined &&
    children !== null &&
    children !== false &&
    children !== ''
  const shouldWrapAddon =
    typeof children === 'string' || typeof children === 'number'

  if (!hasAddon && !Icon) {
    return null
  }

  return (
    <span className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center justify-center text-[#bfab85]">
      {Icon ? (
        <Icon className="size-5 stroke-[1.8]" aria-hidden="true" />
      ) : null}
      {hasAddon && shouldWrapAddon ? (
        <span className="text-base leading-6 font-normal">{children}</span>
      ) : null}
      {hasAddon && !shouldWrapAddon ? children : null}
    </span>
  )
}

export function InvestmentOpportunityFormGrid({ children, className }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-4 md:gap-y-[30px]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function InvestmentOpportunitySectionHeading({ title, className }) {
  return (
    <div
      className={cn(
        'flex items-center justify-start gap-2.5 py-2 text-start',
        className,
      )}
    >
      <h2 className="text-lg leading-7 font-semibold text-[#181927]">
        {title}
      </h2>

      <ChevronUp
        className="size-5 stroke-[2] text-[#181927]"
        aria-hidden="true"
      />
    </div>
  )
}

export function InvestmentOpportunityFormSection({
  title,
  children,
  className,
}) {
  return (
    <section className={cn('space-y-[30px]', className)} aria-label={title}>
      <InvestmentOpportunitySectionHeading title={title} />
      {children}
    </section>
  )
}

export const InvestmentOpportunityTextField = forwardRef(
  function InvestmentOpportunityTextField(
    {
      id,
      label,
      required = false,
      icon,
      addon,
      className,
      inputClassName,
      error,
      type = 'text',
      ...props
    },
    ref,
  ) {
    return (
      <InvestmentOpportunityFieldShell
        id={id}
        label={label}
        required={required}
        className={className}
        error={error}
      >
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={type}
            dir="rtl"
            aria-required={required}
            className={cn(
              'h-12 w-full rounded-lg border border-[#bfab85] bg-[color:var(--dashboard-bg)] px-3 py-3.5 text-start text-sm leading-5 font-normal text-[#402f28] shadow-[var(--dashboard-shadow)] transition outline-none placeholder:text-[#bfab85] focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20 disabled:cursor-not-allowed disabled:opacity-60',
              error &&
                'border-[#b93815] focus-visible:border-[#b93815] focus-visible:ring-[#b93815]/20',
              (icon || addon) && 'pl-14',
              inputClassName,
            )}
            {...props}
          />
          <InvestmentOpportunityFieldAddon icon={icon}>
            {addon}
          </InvestmentOpportunityFieldAddon>
        </div>
      </InvestmentOpportunityFieldShell>
    )
  },
)

export const InvestmentOpportunityTextareaField = forwardRef(
  function InvestmentOpportunityTextareaField(
    {
      id,
      label,
      required = false,
      icon,
      className,
      textareaClassName,
      error,
      ...props
    },
    ref,
  ) {
    return (
      <InvestmentOpportunityFieldShell
        id={id}
        label={label}
        required={required}
        className={className}
        error={error}
      >
        <div className="relative">
          <textarea
            ref={ref}
            id={id}
            dir="rtl"
            aria-required={required}
            className={cn(
              'min-h-[124px] w-full resize-none rounded-lg border border-[#bfab85] bg-[color:var(--dashboard-bg)] px-3 py-3.5 text-start text-sm leading-5 font-normal text-[#402f28] shadow-[var(--dashboard-shadow)] transition outline-none placeholder:text-[#bfab85] focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20 disabled:cursor-not-allowed disabled:opacity-60',
              error &&
                'border-[#b93815] focus-visible:border-[#b93815] focus-visible:ring-[#b93815]/20',
              icon && 'pl-14',
              textareaClassName,
            )}
            {...props}
          />
          <InvestmentOpportunityFieldAddon icon={icon} />
        </div>
      </InvestmentOpportunityFieldShell>
    )
  },
)

export const InvestmentOpportunitySelectField = forwardRef(
  function InvestmentOpportunitySelectField(
    {
      id,
      label,
      required = false,
      options,
      placeholder,
      className,
      selectClassName,
      icon: Icon,
      error,
      ...props
    },
    ref,
  ) {
    return (
      <InvestmentOpportunityFieldShell
        id={id}
        label={label}
        required={required}
        className={className}
        error={error}
      >
        <div className="relative">
          <select
            ref={ref}
            id={id}
            dir="rtl"
            aria-required={required}
            className={cn(
              'h-12 w-full appearance-none rounded-lg border border-[#bfab85] bg-[color:var(--dashboard-bg)] py-3.5 pr-3 pl-12 text-start text-sm leading-5 font-medium text-[#bfab85] shadow-[var(--dashboard-shadow)] transition outline-none focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20',
              error &&
                'border-[#b93815] focus-visible:border-[#b93815] focus-visible:ring-[#b93815]/20',
              selectClassName,
            )}
            {...props}
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
          <span className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center justify-center text-[#bfab85]">
            {Icon ? (
              <Icon className="size-5 stroke-[1.8]" aria-hidden="true" />
            ) : (
              <svg
                viewBox="0 0 20 20"
                className="size-5 fill-none stroke-current"
                aria-hidden="true"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </div>
      </InvestmentOpportunityFieldShell>
    )
  },
)

export const InvestmentOpportunityFilePickerField = forwardRef(
  function InvestmentOpportunityFilePickerField(
    { id, label, required = false, placeholder, className, error, ...props },
    ref,
  ) {
    return (
      <InvestmentOpportunityFieldShell
        id={id}
        label={label}
        required={required}
        className={className}
        error={error}
      >
        <input ref={ref} id={id} type="file" className="sr-only" {...props} />
        <label
          htmlFor={id}
          className={cn(
            'flex h-12 cursor-pointer items-center justify-end gap-2 rounded-lg border border-[#bfab85] bg-[color:var(--dashboard-bg)] px-3.5 text-start text-sm leading-5 font-medium text-[#bfab85] shadow-[var(--dashboard-shadow)] transition hover:border-[#9d7e55]',
            error && 'border-[#b93815] hover:border-[#b93815]',
          )}
        >
          <UploadCloud
            className="size-5 shrink-0 stroke-[1.8]"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 truncate">{placeholder}</span>
        </label>
      </InvestmentOpportunityFieldShell>
    )
  },
)

export const InvestmentOpportunityDropzoneField = forwardRef(
  function InvestmentOpportunityDropzoneField(
    { id, label, className, error, ...props },
    ref,
  ) {
    return (
      <InvestmentOpportunityFieldShell
        id={id}
        label={label}
        className={cn('md:col-span-2', className)}
        error={error}
      >
        <input ref={ref} id={id} type="file" className="sr-only" {...props} />
        <label
          htmlFor={id}
          data-testid="investment-property-images-upload"
          className={cn(
            'flex min-h-[126px] cursor-pointer flex-col items-center justify-center rounded-xl border border-[#d6cbb2] bg-[color:var(--dashboard-bg)] px-6 py-4 text-center shadow-[var(--dashboard-shadow)] transition hover:border-[#bfab85]',
            error && 'border-[#b93815] hover:border-[#b93815]',
          )}
        >
          <span className="mb-3 flex size-10 items-center justify-center rounded-lg border border-[#d6cbb2] text-[#6d4f3b] shadow-[var(--dashboard-shadow)]">
            <UploadCloud className="size-5 stroke-[1.8]" aria-hidden="true" />
          </span>
          <span className="flex flex-wrap items-center justify-center gap-1 text-sm leading-5">
            <span className="font-semibold text-[#6d4f3b]">انقر للرفع</span>
            <span className="font-normal text-[#535862]">أو اسحب وأفلت</span>
          </span>
          <span className="mt-1 text-xs leading-[18px] text-[#535862]">
            SVG أو PNG أو JPG أو GIF (بحد أقصى 800×400 بكسل)
          </span>
        </label>
      </InvestmentOpportunityFieldShell>
    )
  },
)

export function InvestmentOpportunityFormActions({
  submitLabel,
  draftLabel,
  onDraft,
  cancelLabel,
  onCancel,
  disableSubmit = false,
  disableDraft = false,
  disableCancel = false,
}) {
  return (
    <div className="flex items-start justify-start gap-2.5 pt-[30px]" dir="ltr">
      <button
        type="submit"
        disabled={disableSubmit}
        className="h-[47px] w-[176px] rounded-lg border-2 border-white/10 bg-[#402f28] px-3.5 py-2.5 text-sm leading-5 font-semibold text-white shadow-[var(--dashboard-shadow)] transition hover:bg-[#4c382f] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
      >
        {submitLabel}
      </button>
      {onDraft && draftLabel ? (
        <button
          type="button"
          disabled={disableDraft}
          onClick={onDraft}
          className="h-[47px] w-[176px] rounded-lg bg-[#f1ead8] px-3.5 py-2.5 text-sm leading-5 font-semibold text-[#402f28] shadow-[var(--dashboard-shadow)] transition hover:bg-[#e5dac2] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
        >
          {draftLabel}
        </button>
      ) : null}
      <button
        type="button"
        disabled={disableCancel}
        onClick={onCancel}
        className="h-[47px] w-[163px] rounded-lg bg-[#eae5d7] px-3.5 py-2.5 text-sm leading-5 font-semibold text-[#402f28] shadow-[var(--dashboard-shadow)] transition hover:bg-[#ded6c4] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
      >
        {cancelLabel}
      </button>
    </div>
  )
}
