import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTE_PATHS } from '@/app/router/route-paths'

export function LocalizedLink({ to, ...props }) {
  const { i18n } = useTranslation()

  if (typeof to === 'string' && to.startsWith('/')) {
    const localized = ROUTE_PATHS.withLocale(to, i18n.resolvedLanguage)
    return <Link to={localized} {...props} />
  }

  return <Link to={to} {...props} />
}
