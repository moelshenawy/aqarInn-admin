import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { getLocaleFromPath } from '@/lib/i18n/language'

export function useSyncLocaleWithPath() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const localeFromPath = getLocaleFromPath(location.pathname)

  useEffect(() => {
    if (i18n.resolvedLanguage !== localeFromPath) {
      void i18n.changeLanguage(localeFromPath)
    }
  }, [i18n, localeFromPath])

  return localeFromPath
}
