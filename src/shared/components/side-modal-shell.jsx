import { XIcon } from 'lucide-react'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function SideModalShell({
  open,
  onOpenChange,
  title,
  closeLabel = 'إغلاق النافذة',
  side = 'left',
  children,
  className,
  contentClassName,
  overlayClassName,
  closeButtonClassName,
  showCloseButton = true,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        showCloseButton={false}
        overlayClassName={cn(
          'bg-[rgba(46,31,26,0.2)] backdrop-blur-[5px] supports-backdrop-filter:backdrop-blur-[5px]',
          overlayClassName,
        )}
        className={cn(
          'border-0 bg-[#f8f3e8] p-0 text-[#402f28] shadow-none',
          contentClassName,
        )}
        style={{ width: '925px', maxWidth: '120vh' }}
      >
        {title ? <SheetTitle className="sr-only">{title}</SheetTitle> : null}
        <div className={cn('relative min-h-full', className)}>{children}</div>

        {showCloseButton ? (
          <SheetClose asChild>
            <button
              type="button"
              aria-label={closeLabel}
              className={cn(
                'absolute top-4 left-4 z-10 flex size-12 items-center justify-center rounded-full border border-[#eae5d7] bg-[#f8f3e8] text-[#402f28] shadow-[0_1px_2px_rgba(10,13,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18),inset_0_-2px_0_rgba(10,13,18,0.05)] transition hover:bg-[#efe7d7] focus-visible:ring-3 focus-visible:ring-[#9d7e55]/25 focus-visible:outline-none sm:top-[67px] sm:-right-[72px]',
                side === 'right' && 'sm:right-auto sm:-left-[72px]',
                closeButtonClassName,
              )}
            >
              <XIcon className="size-5 stroke-[1.8]" aria-hidden="true" />
            </button>
          </SheetClose>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
