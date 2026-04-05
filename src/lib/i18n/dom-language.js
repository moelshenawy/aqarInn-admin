import { getLanguageDirection } from '@/lib/i18n/language'

export function applyDocumentLanguage(language) {
  if (typeof document === 'undefined') {
    return
  }

  const direction = getLanguageDirection(language)
  document.documentElement.lang = language
  document.documentElement.dir = direction
  document.body.dir = direction
}
