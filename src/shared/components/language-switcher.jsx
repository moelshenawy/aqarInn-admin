import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  getLocaleFromPath,
  stripLocalePrefix,
} from '@/lib/i18n/language'
import { AppButton } from '@/shared/components/app-button'

const LANGUAGES = ['en', 'ar']

export function LanguageSwitcher({ compact = false }) {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const location = useLocation()
  const currentLocale = getLocaleFromPath(location.pathname)

  const handleLanguageChange = (language) => {
    if (currentLocale === language) {
      return
    }

    const normalizedPath = stripLocalePrefix(location.pathname)
    const localizedPath = ROUTE_PATHS.withLocale(normalizedPath, language)
    navigate(`${localizedPath}${location.search}${location.hash}`, {
      replace: true,
    })
  }

  return (
    <div className="border-border bg-background/80 inline-flex items-center gap-1 rounded-full border p-1 shadow-xs">
      {LANGUAGES.map((language) => {
        const active = currentLocale === language
        return (
          <AppButton
            key={language}
            type="button"
            size={compact ? 'xs' : 'sm'}
            variant={active ? 'default' : 'ghost'}
            className="rounded-full px-3"
            onClick={() => handleLanguageChange(language)}
          >
            {language === 'en' ? t('english') : t('arabic')}
          </AppButton>
        )
      })}
    </div>
  )
}
