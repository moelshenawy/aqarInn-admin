import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useDirection } from '@/lib/i18n/direction-provider'

export function DrawerShell({
  open,
  onOpenChange,
  title,
  description,
  children,
}) {
  const { dir } = useDirection()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={dir === 'rtl' ? 'right' : 'left'}
        className="w-full max-w-xl p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-border/70 border-b px-6 py-5 text-start">
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="px-6 py-5">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
