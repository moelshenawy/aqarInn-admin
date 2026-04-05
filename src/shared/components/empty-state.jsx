import { Inbox } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function EmptyState({ title, description }) {
  const { t } = useTranslation('common')

  return (
    <div className="border-border bg-muted/40 rounded-2xl border border-dashed px-6 py-12 text-center">
      <div className="bg-background text-muted-foreground mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl shadow-sm">
        <Inbox className="size-5" />
      </div>
      <h3 className="text-foreground text-base font-semibold">
        {title ?? t('emptyTitle')}
      </h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-lg text-sm leading-6">
        {description ?? t('emptyDescription')}
      </p>
    </div>
  )
}
