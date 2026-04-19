import { Link, useLocation } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { getLocaleFromPath } from '@/lib/i18n/language'

export function LocalizedLink({ to, ...props }) {
  const location = useLocation()
  const currentLocale = getLocaleFromPath(location.pathname)

  if (typeof to === 'string' && to.startsWith('/')) {
    const localized = ROUTE_PATHS.withLocale(to, currentLocale)
    return <Link to={localized} {...props} />
  }

  return <Link to={to} {...props} />
}
