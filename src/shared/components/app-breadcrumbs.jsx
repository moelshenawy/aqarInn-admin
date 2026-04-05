import { Fragment } from 'react'
import { ChevronRight } from 'lucide-react'
import { useMatches } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function AppBreadcrumbs() {
  const { t } = useTranslation(['navigation', 'common'])
  const matches = useMatches().filter((match) => match.handle?.breadcrumbKey)

  return (
    <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
      {matches.map((match, index) => (
        <Fragment key={match.id ?? match.pathname}>
          {index > 0 ? <ChevronRight className="size-4" /> : null}
          <span
            className={
              index === matches.length - 1 ? 'text-foreground font-medium' : ''
            }
          >
            {t(match.handle.breadcrumbKey)}
          </span>
        </Fragment>
      ))}
    </div>
  )
}
