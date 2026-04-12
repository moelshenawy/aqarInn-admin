import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const confirmButtonVariants = {
  default: 'bg-[#402f28] text-white hover:bg-[#4c382f]',
  destructive: 'bg-[#b42318] text-white hover:bg-[#912018]',
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'إلغاء',
  closeLabel = 'إغلاق النافذة',
  onConfirm,
  onCancel,
  confirmVariant = 'default',
  dir = 'rtl',
  confirmDisabled = false,
  cancelDisabled = false,
  className,
}) {
  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleConfirm = () => {
    onConfirm?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir={dir}
        showCloseButton={false}
        className={cn(
          'block h-[271px] w-[min(628px,calc(100vw-32px))] max-w-none min-w-0 overflow-hidden rounded-[20px] border-0 bg-[#f8f3e8] p-0 text-start text-[#402f28] shadow-none ring-0',
          className,
        )}
      >
        <DialogClose asChild>
          <button
            type="button"
            aria-label={closeLabel}
            className={cn(
              'absolute top-6 flex size-12 items-center justify-center rounded-full border border-[#eae5d7] bg-[#f8f3e8] text-[#402f28] shadow-[0_1px_2px_rgba(10,13,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.08)] transition hover:bg-[#f5f0e5] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none',
              dir === 'rtl' ? 'left-[27px]' : 'right-[27px]',
            )}
          >
            <XIcon className="size-5 stroke-[2]" aria-hidden="true" />
          </button>
        </DialogClose>

        <div
          className={cn(
            'absolute top-5 flex flex-col items-start gap-8',
            dir === 'rtl'
              ? 'right-[41px] left-[70px]'
              : 'right-[70px] left-[41px]',
          )}
        >
          <DialogTitle className="w-full text-start text-2xl leading-8 font-semibold text-[#181927]">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="w-full text-start text-lg leading-7 font-medium text-[#402f28]">
              {description}
            </DialogDescription>
          ) : null}
        </div>

        <div
          className={cn(
            'absolute bottom-[33px] flex h-[43px] items-start gap-[15px]',
            dir === 'rtl'
              ? 'left-[29px] justify-start'
              : 'right-[29px] flex-row-reverse justify-end',
          )}
        >
          <button
            type="button"
            disabled={cancelDisabled}
            onClick={handleCancel}
            className="relative flex h-full w-[179px] items-center justify-center overflow-hidden rounded-lg bg-[#402f28] px-3.5 py-2.5 text-sm leading-5 font-semibold text-white shadow-[0_1px_2px_rgba(10,13,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_rgba(10,13,18,0.05)] transition hover:bg-[#4c382f] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={confirmDisabled}
            onClick={handleConfirm}
            className={cn(
              'relative flex h-full w-[172px] items-center justify-center overflow-hidden rounded-lg border-2 border-white/10 px-3.5 py-2.5 text-sm leading-5 font-semibold whitespace-nowrap shadow-[0_1px_2px_rgba(10,13,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_rgba(10,13,18,0.05)] transition focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
              confirmButtonVariants[confirmVariant] ??
                confirmButtonVariants.default,
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
