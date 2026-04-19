export const SUPPORTED_LANGUAGES = ['en', 'ar']
export const DEFAULT_LANGUAGE = 'ar'
export const LANGUAGE_STORAGE_KEY = 'aqarinn.backoffice.language'

export function getInitialLanguage() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    return storedLanguage
  }

  const browserLanguage = window.navigator.language?.slice(0, 2)?.toLowerCase()
  return SUPPORTED_LANGUAGES.includes(browserLanguage)
    ? browserLanguage
    : DEFAULT_LANGUAGE
}

export function persistLanguage(language) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }
}

export function getLanguageDirection(language) {
  return language === 'ar' ? 'rtl' : 'ltr'
}

export function getLocaleFromPath(pathname = '') {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ar'
}

export function stripLocalePrefix(pathname = '') {
  if (pathname === '/en' || pathname === '/ar') {
    return '/'
  }

  return pathname.replace(/^\/(en|ar)(?=\/|$)/, '') || '/'
}

export function getCurrentPathLocale() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  return getLocaleFromPath(window.location.pathname)
}
