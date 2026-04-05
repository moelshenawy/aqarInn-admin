import { useTranslation } from 'react-i18next'

export function PageHeader({
  titleKey,
  descriptionKey,
  title,
  description,
  actions,
}) {
  const { t } = useTranslation(['common', 'navigation'])

  return (
    <div className="border-border/70 bg-card flex flex-col gap-4 rounded-3xl border px-5 py-5 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:px-6">
      <div className="space-y-2">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          {title ?? (titleKey ? t(titleKey) : '')}
        </h1>
        {description || descriptionKey ? (
          <p className="text-muted-foreground max-w-3xl text-sm leading-6">
            {description ?? t(descriptionKey)}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
