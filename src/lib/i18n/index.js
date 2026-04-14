import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { applyDocumentLanguage } from '@/lib/i18n/dom-language'
import { getInitialLanguage, persistLanguage } from '@/lib/i18n/language'

import arAuth from '@/lib/i18n/locales/ar/auth.json'
import arCommon from '@/lib/i18n/locales/ar/common.json'
import arDashboard from '@/lib/i18n/locales/ar/dashboard.json'
import arNavigation from '@/lib/i18n/locales/ar/navigation.json'
import arNotifications from '@/lib/i18n/locales/ar/notifications.json'
import arPermissions from '@/lib/i18n/locales/ar/permissions.json'
import arValidation from '@/lib/i18n/locales/ar/validation.json'
import enAuth from '@/lib/i18n/locales/en/auth.json'
import enCommon from '@/lib/i18n/locales/en/common.json'
import enDashboard from '@/lib/i18n/locales/en/dashboard.json'
import enNavigation from '@/lib/i18n/locales/en/navigation.json'
import enNotifications from '@/lib/i18n/locales/en/notifications.json'
import enPermissions from '@/lib/i18n/locales/en/permissions.json'
import enValidation from '@/lib/i18n/locales/en/validation.json'

const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
    dashboard: enDashboard,
    navigation: enNavigation,
    notifications: enNotifications,
    permissions: enPermissions,
    validation: enValidation,
  },
  ar: {
    auth: arAuth,
    common: arCommon,
    dashboard: arDashboard,
    navigation: arNavigation,
    notifications: arNotifications,
    permissions: arPermissions,
    validation: arValidation,
  },
}

// Get locale from URL if present
function getLocaleFromUrl() {
  if (typeof window === 'undefined') return null
  const path = window.location.pathname
  if (path.startsWith('/en')) return 'en'
  return 'ar'
}

const urlLocale = getLocaleFromUrl()
const initialLanguage = urlLocale || getInitialLanguage()

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'ar'],
  defaultNS: 'common',
  ns: [
    'common',
    'navigation',
    'auth',
    'dashboard',
    'notifications',
    'validation',
    'permissions',
  ],
  interpolation: { escapeValue: false },
  returnNull: false,
})

applyDocumentLanguage(initialLanguage)
i18n.on('languageChanged', (language) => {
  persistLanguage(language)
  applyDocumentLanguage(language)
})

export default i18n
