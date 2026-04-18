import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AppButton } from '@/shared/components/app-button'

const LANGUAGES = ['en', 'ar']

export function LanguageSwitcher({ compact = false }) {
  const { i18n, t } = useTranslation('common')
  const navigate = useNavigate()
  const location = useLocation()

  const handleLanguageChange = (language) => {
    if (i18n.resolvedLanguage === language) {
      return
    }

    void i18n.changeLanguage(language)
    const localizedPath = ROUTE_PATHS.withLocale(location.pathname, language)
    navigate(`${localizedPath}${location.search}${location.hash}`, {
      replace: true,
    })
  }

  return (
    <div className="border-border bg-background/80 inline-flex items-center gap-1 rounded-full border p-1 shadow-xs">
      {LANGUAGES.map((language) => {
        const active = i18n.resolvedLanguage === language
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
