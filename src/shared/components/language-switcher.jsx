import { useTranslation } from 'react-i18next'

import { AppButton } from '@/shared/components/app-button'

const LANGUAGES = ['en', 'ar']

export function LanguageSwitcher({ compact = false }) {
  const { i18n, t } = useTranslation('common')

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
            onClick={() => i18n.changeLanguage(language)}
          >
            {language === 'en' ? t('english') : t('arabic')}
          </AppButton>
        )
      })}
    </div>
  )
}
