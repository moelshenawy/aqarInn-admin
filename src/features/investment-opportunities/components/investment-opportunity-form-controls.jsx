import { forwardRef, useId, useState } from 'react'
import { ChevronUp, LoaderCircle, UploadCloud, X } from 'lucide-react'

import { useDirection } from '@/lib/i18n/direction-provider'
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

function FileSelectionSummary({
  selectedFiles,
  isLoading = false,
  idleMessage,
  loadingMessage,
  onRemoveFile,
}) {
  const files = normalizeFiles(selectedFiles)

  if (isLoading) {
    return (
      <div className="flex items-center justify-end gap-2 text-xs leading-5 font-medium text-[#6d4f3b]">
        <span>{loadingMessage}</span>
        <LoaderCircle
          className="size-4 animate-spin stroke-[1.8]"
          aria-hidden="true"
        />
      </div>
    )
  }

  if (!files.length) {
    return idleMessage ? (
      <p className="text-xs leading-5 font-medium text-[#717680]">
        {idleMessage}
      </p>
    ) : null
  }

  return (
    <div className="flex flex-col items-end gap-2 text-xs leading-5 font-medium text-[#6d4f3b]">
      <p>
        {files.length === 1
          ? files[0].name
          : `\u062A\u0645 \u0627\u062E\u062A\u064A\u0627\u0631 ${files.length} \u0645\u0644\u0641\u0627\u062A`}
      </p>
      <div className="flex w-full flex-wrap justify-end gap-2">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#d6cbb2] bg-[#f7f4ec] px-3 py-1 text-[#6d4f3b]"
          >
            <button
              type="button"
              onClick={() => onRemoveFile?.(index)}
              className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[#9d7e55] transition hover:text-[#402f28] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/30 focus-visible:outline-none"
              aria-label={`\u0625\u0632\u0627\u0644\u0629 ${file.name}`}
            >
              <X className="size-3 stroke-[2.2]" aria-hidden="true" />
            </button>
            <span className="truncate">{file.name}</span>
          </div>
        ))}
      </div>
    </div>
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

export function InvestmentOpportunitySectionHeading({
  title,
  className,
  expanded = true,
  onToggle,
  contentId,
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={contentId}
      className={cn(
        'flex cursor-pointer items-center justify-start gap-2.5 py-2 text-start transition focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none',
        className,
      )}
    >
      <h2 className="text-lg leading-7 font-semibold text-[#181927]">
        {title}
      </h2>

      <ChevronUp
        className={cn(
          'size-5 stroke-[2] text-[#181927] transition-transform',
          !expanded && 'rotate-180',
        )}
        aria-hidden="true"
      />
    </button>
  )
}

function CollapsiblePanel({ id, expanded, children, expandedMarginClass }) {
  return (
    <div
      id={id}
      aria-hidden={!expanded}
      className={cn(
        'grid overflow-hidden transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out motion-reduce:transition-none',
        expanded
          ? `grid-rows-[1fr] opacity-100 ${expandedMarginClass}`
          : 'mt-0 grid-rows-[0fr] opacity-0 pointer-events-none',
      )}
    >
      <div className="min-h-0">{children}</div>
    </div>
  )
}

export function InvestmentOpportunityFormSection({
  title,
  children,
  className,
  defaultExpanded = true,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const sectionId = useId()
  const contentId = `${sectionId}-content`

  return (
    <section className={cn('flex flex-col', className)} aria-label={title}>
      <InvestmentOpportunitySectionHeading
        title={title}
        expanded={isExpanded}
        onToggle={() => setIsExpanded((current) => !current)}
        contentId={contentId}
      />
      <CollapsiblePanel
        id={contentId}
        expanded={isExpanded}
        expandedMarginClass="mt-[30px]"
      >
        {children}
      </CollapsiblePanel>
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
              'h-12 w-full rounded-lg border border-[#bfab85] bg-[color:var(--dashboard-bg)] px-3 text-start text-sm leading-5 font-normal text-[#402f28] shadow-[var(--dashboard-shadow)] transition outline-none placeholder:text-[#bfab85] focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20 disabled:cursor-not-allowed disabled:opacity-60',
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
              'min-h-[124px] w-full resize-none rounded-lg border border-[#bfab85] bg-[color:var(--dashboard-bg)] px-3 text-start text-sm leading-5 font-normal text-[#402f28] shadow-[var(--dashboard-shadow)] transition outline-none placeholder:text-[#bfab85] focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20 disabled:cursor-not-allowed disabled:opacity-60',
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
              'h-12 w-full appearance-none rounded-lg border border-[#bfab85] bg-[color:var(--dashboard-bg)] pr-3 pl-12 text-start text-sm leading-5 font-medium text-[#bfab85] shadow-[var(--dashboard-shadow)] transition outline-none focus-visible:border-[#9d7e55] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/20',
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
    {
      id,
      label,
      required = false,
      placeholder,
      className,
      error,
      selectedFiles,
      isLoading = false,
      onRemoveFile,
      ...props
    },
    ref,
  ) {
    const files = normalizeFiles(selectedFiles)

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
          {isLoading ? (
            <LoaderCircle
              className="size-5 shrink-0 animate-spin stroke-[1.8]"
              aria-hidden="true"
            />
          ) : (
            <UploadCloud
              className="size-5 shrink-0 stroke-[1.8]"
              aria-hidden="true"
            />
          )}
          <span className="min-w-0 flex-1 truncate">
            {files[0]?.name ?? placeholder}
          </span>
        </label>
        <FileSelectionSummary
          selectedFiles={selectedFiles}
          isLoading={isLoading}
          loadingMessage="\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0644\u0641..."
          onRemoveFile={onRemoveFile}
        />
      </InvestmentOpportunityFieldShell>
    )
  },
)

export const InvestmentOpportunityDropzoneField = forwardRef(
  function InvestmentOpportunityDropzoneField(
    {
      id,
      label,
      className,
      error,
      selectedFiles,
      isLoading = false,
      onRemoveFile,
      ...props
    },
    ref,
  ) {
    const files = normalizeFiles(selectedFiles)

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
            {isLoading ? (
              <LoaderCircle
                className="size-5 animate-spin stroke-[1.8]"
                aria-hidden="true"
              />
            ) : (
              <UploadCloud className="size-5 stroke-[1.8]" aria-hidden="true" />
            )}
          </span>
          <span className="flex flex-wrap items-center justify-center gap-1 text-sm leading-5">
            <span className="font-semibold text-[#6d4f3b]">
              {files.length
                ? '\u062A\u0645 \u0631\u0641\u0639 \u0627\u0644\u0635\u0648\u0631'
                : '\u0627\u0646\u0642\u0631 \u0644\u0644\u0631\u0641\u0639'}
            </span>
            <span className="font-normal text-[#535862]">
              {files.length
                ? `${files.length} \u0635\u0648\u0631\u0629`
                : '\u0623\u0648 \u0627\u0633\u062D\u0628 \u0648\u0623\u0641\u0644\u062A'}
            </span>
          </span>
          <span className="mt-1 text-xs leading-[18px] text-[#535862]">
            {isLoading
              ? '\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0635\u0648\u0631 \u0627\u0644\u0645\u0631\u0641\u0648\u0639\u0629...'
              : 'SVG \u0623\u0648 PNG \u0623\u0648 JPG \u0623\u0648 GIF (\u0628\u062D\u062F \u0623\u0642\u0635\u0649 800\u00D7400 \u0628\u0643\u0633\u0644)'}
          </span>
        </label>
        <FileSelectionSummary
          selectedFiles={selectedFiles}
          isLoading={isLoading}
          loadingMessage="\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0635\u0648\u0631..."
          onRemoveFile={onRemoveFile}
        />
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
  const { dir } = useDirection()

  return (
    <div className="flex items-start justify-end gap-2.5 pt-[30px]" dir={dir}>
      <button
        type="button"
        disabled={disableCancel}
        onClick={onCancel}
        className="h-[47px] w-[163px] rounded-lg bg-[#eae5d7] px-3.5 py-2.5 text-sm leading-5 font-semibold text-[#402f28] shadow-[var(--dashboard-shadow)] transition hover:bg-[#ded6c4] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
      >
        {cancelLabel}
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
        type="submit"
        disabled={disableSubmit}
        className="h-[47px] w-[176px] rounded-lg border-2 border-white/10 bg-[#402f28] px-3.5 py-2.5 text-sm leading-5 font-semibold text-white shadow-[var(--dashboard-shadow)] transition hover:bg-[#4c382f] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
      >
        {submitLabel}
      </button>
    </div>
  )
}
