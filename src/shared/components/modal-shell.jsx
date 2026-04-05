import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function ModalShell({
  open,
  onOpenChange,
  title,
  description,
  children,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-3xl p-0">
        <DialogHeader className="border-border/70 border-b px-6 py-5">
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="px-6 py-5">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
