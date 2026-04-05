import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { applyDocumentLanguage } from '@/lib/i18n/dom-language'
import { getInitialLanguage, persistLanguage } from '@/lib/i18n/language'

import arAuth from '@/lib/i18n/locales/ar/auth.json'
import arCommon from '@/lib/i18n/locales/ar/common.json'
import arNavigation from '@/lib/i18n/locales/ar/navigation.json'
import arPermissions from '@/lib/i18n/locales/ar/permissions.json'
import arValidation from '@/lib/i18n/locales/ar/validation.json'
import enAuth from '@/lib/i18n/locales/en/auth.json'
import enCommon from '@/lib/i18n/locales/en/common.json'
import enNavigation from '@/lib/i18n/locales/en/navigation.json'
import enPermissions from '@/lib/i18n/locales/en/permissions.json'
import enValidation from '@/lib/i18n/locales/en/validation.json'

const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
    navigation: enNavigation,
    permissions: enPermissions,
    validation: enValidation,
  },
  ar: {
    auth: arAuth,
    common: arCommon,
    navigation: arNavigation,
    permissions: arPermissions,
    validation: arValidation,
  },
}

const initialLanguage = getInitialLanguage()

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'ar'],
  defaultNS: 'common',
  ns: ['common', 'navigation', 'auth', 'validation', 'permissions'],
  interpolation: { escapeValue: false },
  returnNull: false,
})

applyDocumentLanguage(initialLanguage)
i18n.on('languageChanged', (language) => {
  persistLanguage(language)
  applyDocumentLanguage(language)
})

export default i18n
