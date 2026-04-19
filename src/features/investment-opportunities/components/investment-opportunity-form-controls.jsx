import { forwardRef, useEffect, useId, useState } from 'react'
import {
  ArrowRight,
  ChevronUp,
  Eye,
  FileText,
  LoaderCircle,
  UploadCloud,
  X,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
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

function createObjectUrlSafe(file) {
  if (
    typeof Blob === 'undefined' ||
    typeof URL === 'undefined' ||
    typeof URL.createObjectURL !== 'function' ||
    !(file instanceof Blob)
  ) {
    return ''
  }

  try {
    return URL.createObjectURL(file)
  } catch {
    return ''
  }
}

function revokeObjectUrlSafe(url) {
  if (
    !url ||
    typeof URL === 'undefined' ||
    typeof URL.revokeObjectURL !== 'function'
  ) {
    return
  }

  try {
    URL.revokeObjectURL(url)
  } catch {
    // No-op
  }
}

function buildCompactFileNames(files) {
  if (!files.length) {
    return ''
  }

  const visibleNames = files.slice(0, 3).map((file) => file?.name).filter(Boolean)
  if (!visibleNames.length) {
    return ''
  }

  if (files.length <= 3) {
    return visibleNames.join('، ')
  }

  return `${visibleNames.join('، ')} +${files.length - 3}`
}

function getFileExtension(fileName) {
  const normalizedName = String(fileName ?? '').trim()
  const extension = normalizedName.split('.').pop()?.trim().toLowerCase()

  if (!extension || extension === normalizedName.toLowerCase()) {
    return 'file'
  }

  return extension
}

function getPreviewKind(previewItem) {
  if (previewItem?.previewKind) {
    return previewItem.previewKind
  }

  const mimeType = String(previewItem?.file?.type ?? '').toLowerCase()
  if (mimeType.startsWith('image/')) {
    return 'image'
  }

  if (mimeType === 'application/pdf') {
    return 'pdf'
  }

  return 'unsupported'
}

function buildPreviewItemFromFile(file, index) {
  return {
    index,
    file,
    name: file?.name ?? '',
    extension: getFileExtension(file?.name),
    previewKind: getPreviewKind({ file }),
  }
}

function getFileTypeBadgeColor(extension) {
  if (extension === 'pdf') {
    return '#d92d20'
  }

  if (extension === 'txt') {
    return '#535862'
  }

  if (extension === 'doc' || extension === 'docx') {
    return '#402f28'
  }

  return '#6d4f3b'
}

function InvestmentOpportunityFileTypeIcon({ extension }) {
  const badgeLabel = String(extension ?? 'file')
    .toUpperCase()
    .slice(0, 4)
  const badgeColor = getFileTypeBadgeColor(String(extension ?? '').toLowerCase())

  return (
    <div className="relative size-[56px] rounded-md border border-[#d6cbb2] bg-[#d8d1c0]">
      <div className="absolute top-0 right-0 h-3.5 w-3.5 rounded-tr-md border-t border-r border-[#efe9dc] bg-[#eee8da]" />
      <span
        className="absolute right-1 bottom-1 rounded-[3px] px-1.5 py-0.5 text-[10px] leading-3 font-bold tracking-[0.03em] text-white"
        style={{ backgroundColor: badgeColor }}
      >
        {badgeLabel}
      </span>
    </div>
  )
}

function InvestmentOpportunityUploadedFilesModal({
  open = false,
  previewItems = [],
  onOpenChange,
  onOpenFilePreview,
  onUploadMore,
  onRemoveFile,
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onOpenChange?.(false)
        }
      }}
    >
      <DialogContent
        dir="rtl"
        showCloseButton={false}
        className="w-[min(848px,calc(100vw-32px))] max-w-none rounded-[17px] border-0 bg-[#f8f3e8] px-[27px] pt-5 pb-[30px] text-start shadow-none"
      >
        <div className="flex items-center justify-end gap-[58px] pb-5">
          <button
            type="button"
            onClick={() => onOpenChange?.(false)}
            aria-label={
              '\u0625\u063A\u0644\u0627\u0642 \u0646\u0627\u0641\u0630\u0629 \u0627\u0644\u0645\u0644\u0641\u0627\u062A'
            }
            className="inline-flex size-12 items-center justify-center rounded-full border border-[#eae5d7] bg-[#f8f3e8] text-[#402f28] shadow-[0_1px_2px_rgba(10,13,18,0.05)] transition hover:bg-[#f1ead8] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
          >
            <X className="size-5 stroke-[2]" aria-hidden="true" />
          </button>
          <DialogTitle className="min-w-0 flex-1 text-end text-2xl leading-8 font-semibold text-[#181927]">
            {'\u0627\u0644\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {'\u0639\u0631\u0636 \u0648\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0627\u0644\u0645\u0631\u0641\u0648\u0639\u0629'}
          </DialogDescription>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {previewItems.map((previewItem) => (
            <div
              key={`${previewItem.name}-${previewItem.index}`}
              className="flex h-24 items-center justify-end gap-5 rounded-[10px] bg-[#eae5d7] px-5 py-2.5"
            >
              <InvestmentOpportunityFileTypeIcon
                extension={previewItem.extension ?? getFileExtension(previewItem.name)}
              />
              <p className="min-w-0 flex-1 text-end text-xl leading-[30px] font-medium text-[#6d4f3b]">
                <span className="line-clamp-2 break-all">{previewItem.name}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenFilePreview?.(previewItem)}
                  className="inline-flex size-8 items-center justify-center rounded-md text-[#6d4f3b] transition hover:bg-[#f5f1e8] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/30 focus-visible:outline-none"
                  aria-label={`\u0645\u0639\u0627\u064A\u0646\u0629 ${previewItem.name}`}
                >
                  <Eye className="size-[18px] stroke-[1.8]" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveFile?.(previewItem.index)}
                  className="inline-flex size-8 items-center justify-center rounded-md text-[#6d4f3b] transition hover:bg-[#f5f1e8] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/30 focus-visible:outline-none"
                  aria-label={`\u0625\u0632\u0627\u0644\u0629 ${previewItem.name}`}
                >
                  <X className="size-[18px] stroke-[2]" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onUploadMore}
          className="mt-5 flex h-[60px] w-full items-center justify-center rounded-lg border-2 border-white/10 bg-[#402f28] px-3.5 text-xl leading-[30px] font-medium text-[#fafafa] shadow-[var(--dashboard-shadow)] transition hover:bg-[#4c382f] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
        >
          {'\u0631\u0641\u0639 \u0645\u0644\u0641'}
        </button>
      </DialogContent>
    </Dialog>
  )
}

function InvestmentOpportunitySingleFilePreviewModal({
  open = false,
  selectedPreviewItem,
  onOpenChange,
  onBackToFilesModal,
}) {
  const [previewUrl, setPreviewUrl] = useState('')
  const previewKind = getPreviewKind(selectedPreviewItem)
  const selectedFileName = selectedPreviewItem?.name ?? ''

  useEffect(() => {
    if (!selectedPreviewItem?.file || previewKind === 'unsupported') {
      setPreviewUrl('')
      return
    }

    const nextPreviewUrl = createObjectUrlSafe(selectedPreviewItem.file)
    setPreviewUrl(nextPreviewUrl)

    return () => {
      revokeObjectUrlSafe(nextPreviewUrl)
    }
  }, [previewKind, selectedPreviewItem])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onOpenChange?.(false)
        }
      }}
    >
      <DialogContent
        dir="rtl"
        showCloseButton={false}
        className="h-auto w-[min(848px,calc(100vw-32px))] max-w-none rounded-[17px] border-0 bg-[#f8f3e8] px-[27px] pt-5 pb-[30px] text-start shadow-none"
      >
        <div className="flex items-center justify-end gap-[58px] pb-5">
          <button
            type="button"
            onClick={() => onOpenChange?.(false)}
            aria-label={
              '\u0625\u063A\u0644\u0627\u0642 \u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0645\u0644\u0641'
            }
            className="inline-flex size-12 items-center justify-center rounded-full border border-[#eae5d7] bg-[#f8f3e8] text-[#402f28] shadow-[0_1px_2px_rgba(10,13,18,0.05)] transition hover:bg-[#f1ead8] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none"
          >
            <X className="size-5 stroke-[2]" aria-hidden="true" />
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
            <DialogTitle className="min-w-0 flex-1 truncate text-end text-2xl leading-8 font-semibold text-[#181927]">
              {selectedFileName}
            </DialogTitle>
            <button
              type="button"
              onClick={onBackToFilesModal}
              aria-label={
                '\u0627\u0644\u0631\u062C\u0648\u0639 \u0625\u0644\u0649 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0644\u0641\u0627\u062A'
              }
              className="inline-flex size-8 items-center justify-center rounded-md text-[#6d4f3b] transition hover:bg-[#f1ead8] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/30 focus-visible:outline-none"
            >
              <ArrowRight className="size-5 stroke-[1.8]" aria-hidden="true" />
            </button>
          </div>
          <DialogDescription className="sr-only">
            {'\u0645\u0639\u0627\u064A\u0646\u0629 \u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0645\u062D\u062F\u062F'}
          </DialogDescription>
        </div>

        <div className="h-[560px] overflow-hidden rounded-[14px] bg-[#eae5d7] md:h-[680px]">
          {previewKind === 'image' && previewUrl ? (
            <img
              src={previewUrl}
              alt={selectedFileName}
              className="size-full object-contain"
            />
          ) : null}
          {previewKind === 'pdf' && previewUrl ? (
            <iframe
              src={previewUrl}
              title={selectedFileName}
              className="size-full border-0"
            />
          ) : null}
          {previewKind === 'unsupported' || !previewUrl ? (
            <div className="flex size-full flex-col items-center justify-center gap-3 px-6 text-center text-[#6d4f3b]">
              <FileText className="size-10 stroke-[1.8]" aria-hidden="true" />
              <p className="text-base leading-6 font-semibold">
                {'\u062A\u0639\u0630\u0631 \u0639\u0631\u0636 \u0627\u0644\u0645\u0644\u0641 \u062F\u0627\u062E\u0644 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629'}
              </p>
              <p className="text-sm leading-5 font-medium text-[#535862]">
                {'\u064A\u0645\u0643\u0646 \u0641\u062A\u062D \u0627\u0644\u0645\u0644\u0641 \u0645\u062D\u0644\u064A\u0627\u064B \u0644\u0645\u0631\u0627\u062C\u0639\u062A\u0647'}
              </p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
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
      enableFilesModal = false,
      previewItems = [],
      selectedPreviewItem = null,
      isFilesModalOpen = false,
      isPreviewModalOpen = false,
      onOpenFilesModal,
      onCloseFilesModal,
      onOpenFilePreview,
      onClosePreviewModal,
      onBackToFilesModal,
      onUploadMore,
      ...props
    },
    ref,
  ) {
    const files = normalizeFiles(selectedFiles)
    const isDocumentsFilledState = enableFilesModal && files.length > 0
    const compactFileNames = buildCompactFileNames(files) || placeholder
    const resolvedPreviewItems = previewItems.length
      ? previewItems
      : files.map((file, index) => buildPreviewItemFromFile(file, index))

    const handleUploadMore = () => {
      onUploadMore?.()
    }

    return (
      <InvestmentOpportunityFieldShell
        id={id}
        label={label}
        required={required}
        className={className}
        error={error}
      >
        <input ref={ref} id={id} type="file" className="sr-only" {...props} />
        {isDocumentsFilledState ? (
          <>
            <div
              className={cn(
                'flex h-12 items-center justify-end gap-2 rounded-lg border border-[#bfab85] bg-[color:var(--dashboard-bg)] px-3.5 text-sm leading-5 shadow-[var(--dashboard-shadow)] transition',
                error && 'border-[#b93815]',
              )}
            >
              <button
                type="button"
                onClick={handleUploadMore}
                aria-label={
                  '\u0631\u0641\u0639 \u0645\u0644\u0641 \u0625\u0636\u0627\u0641\u064A'
                }
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[#6d4f3b] transition hover:bg-[#f1ead8] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/30 focus-visible:outline-none"
              >
                {isLoading ? (
                  <LoaderCircle
                    className="size-5 animate-spin stroke-[1.8]"
                    aria-hidden="true"
                  />
                ) : (
                  <UploadCloud className="size-5 stroke-[1.8]" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={onOpenFilesModal}
                aria-label={
                  '\u0639\u0631\u0636 \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0627\u0644\u0645\u0631\u0641\u0648\u0639\u0629'
                }
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[#6d4f3b] transition hover:bg-[#f1ead8] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/30 focus-visible:outline-none"
              >
                <Eye className="size-5 stroke-[1.8]" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleUploadMore}
                className="min-w-0 flex-1 truncate text-end text-sm leading-5 font-semibold text-[#402f28] focus-visible:outline-none"
              >
                {compactFileNames}
              </button>
            </div>
            <InvestmentOpportunityUploadedFilesModal
              open={isFilesModalOpen}
              previewItems={resolvedPreviewItems}
              onOpenChange={onCloseFilesModal}
              onOpenFilePreview={onOpenFilePreview}
              onUploadMore={onUploadMore}
              onRemoveFile={onRemoveFile}
            />
            <InvestmentOpportunitySingleFilePreviewModal
              open={isPreviewModalOpen}
              selectedPreviewItem={selectedPreviewItem}
              onOpenChange={onClosePreviewModal}
              onBackToFilesModal={onBackToFilesModal}
            />
          </>
        ) : (
          <>
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
              loadingMessage={
                '\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0644\u0641...'
              }
              onRemoveFile={onRemoveFile}
            />
          </>
        )}
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
      imagePreviewUrls = [],
      isLoading = false,
      onRemoveFile,
      ...props
    },
    ref,
  ) {
    const files = normalizeFiles(selectedFiles)
    const hasFilledGallery = files.length > 0
    const galleryItems = files.map((file, index) => ({
      file,
      index,
      previewUrl: imagePreviewUrls[index] ?? '',
    }))

    return (
      <InvestmentOpportunityFieldShell
        id={id}
        label={label}
        className={cn('md:col-span-2', className)}
        error={error}
      >
        <input ref={ref} id={id} type="file" className="sr-only" {...props} />
        {hasFilledGallery ? (
          <div className="flex flex-wrap items-center justify-end gap-4">
            {galleryItems.map((galleryItem) => (
              <div
                key={`${galleryItem.file.name}-${galleryItem.index}`}
                className="relative h-[104px] w-[165px] shrink-0 overflow-hidden rounded-xl bg-[#d6cbb2]"
              >
                {galleryItem.previewUrl ? (
                  <img
                    src={galleryItem.previewUrl}
                    alt={galleryItem.file.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-[#c9bfa8] px-2 text-center text-xs leading-5 font-semibold text-[#402f28]">
                    <span className="line-clamp-2 break-all">
                      {galleryItem.file.name}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveFile?.(galleryItem.index)}
                  className="absolute top-2 left-2 inline-flex size-6 items-center justify-center rounded-full bg-[#f8f3e8]/95 text-[#402f28] shadow-[0_1px_2px_rgba(10,13,18,0.08)] transition hover:bg-[#f8f3e8] focus-visible:ring-2 focus-visible:ring-[#9d7e55]/30 focus-visible:outline-none"
                  aria-label={`\u0625\u0632\u0627\u0644\u0629 ${galleryItem.file.name}`}
                >
                  <X className="size-4 stroke-[2]" aria-hidden="true" />
                </button>
              </div>
            ))}
            <label
              htmlFor={id}
              data-testid="investment-property-images-upload"
              className={cn(
                'flex h-[104px] min-w-[165px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-[#d6cbb2] bg-[color:var(--dashboard-bg)] px-6 py-4 text-center transition hover:border-[#bfab85]',
                error && 'border-[#b93815] hover:border-[#b93815]',
              )}
            >
              <span className="mb-2 flex size-10 items-center justify-center rounded-lg border border-[#d6cbb2] text-[#6d4f3b] shadow-[var(--dashboard-shadow)]">
                {isLoading ? (
                  <LoaderCircle
                    className="size-5 animate-spin stroke-[1.8]"
                    aria-hidden="true"
                  />
                ) : (
                  <UploadCloud className="size-5 stroke-[1.8]" aria-hidden="true" />
                )}
              </span>
              <span className="text-sm leading-5 font-normal text-[#535862]">
                {'\u0627\u0646\u0642\u0631 \u0644\u0644\u0631\u0641\u0639 \u0623\u0648 \u0627\u0633\u062D\u0628 \u0648\u0623\u0641\u0644\u062A'}
              </span>
            </label>
          </div>
        ) : (
          <>
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
                  <UploadCloud
                    className="size-5 stroke-[1.8]"
                    aria-hidden="true"
                  />
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
              loadingMessage={
                '\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0635\u0648\u0631...'
              }
              onRemoveFile={onRemoveFile}
            />
          </>
        )}
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
