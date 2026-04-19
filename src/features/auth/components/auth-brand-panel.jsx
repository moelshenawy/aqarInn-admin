import { Globe } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { AUTH_LOGO_SRC } from '@/features/auth/constants/auth-ui'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { getLocaleFromPath, stripLocalePrefix } from '@/lib/i18n/language'
import { cn } from '@/lib/utils'
import { LocalizedLink } from '@/shared/components/localized-link'

export function AuthBrandPanel({ className }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('auth')
  const currentLocale = getLocaleFromPath(location.pathname)

  const handleLocaleSwitch = () => {
    const newLocale = currentLocale === 'ar' ? 'en' : 'ar'
    const normalizedPath = stripLocalePrefix(location.pathname)
    const localizedPath = ROUTE_PATHS.withLocale(normalizedPath, newLocale)
    navigate(`${localizedPath}${location.search}${location.hash}`, {
      replace: true,
    })
  }

  return (
    <section className={cn('auth-brand-panel', className)}>
      <LocalizedLink to={ROUTE_PATHS.login} aria-label={t('goBackToLogin')}>
        <div className="flex justify-start">
          <img src={AUTH_LOGO_SRC} alt="Aqar Inn" className="auth-brand-logo" />
        </div>
      </LocalizedLink>

      <div className="auth-brand-copy space-y-[25px]">
        <h1 className="text-[30px] leading-[38px] font-semibold text-[#252b37] md:text-[36px] md:leading-[44px]">
          {t('brand.titlePartOne')}
          <br />
          {t('brand.titlePartTwo')}
        </h1>
        <p className="auth-brand-description text-[18px] leading-[28px] font-normal text-[#414651] md:text-[20px] md:leading-[30px]">
          {t('brand.description')}
        </p>
      </div>

      <div className="flex items-center justify-start gap-1.5 text-[#5c4437]">
        <button
          type="button"
          className="text-sm leading-5 font-semibold hover:underline focus:outline-none"
          aria-label={
            currentLocale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'
          }
          onClick={handleLocaleSwitch}
        >
          {currentLocale === 'ar' ? 'EN' : 'العربية'}
        </button>
        <Globe className="size-4 stroke-[1.6]" />
      </div>
    </section>
  )
}
