import axios from 'axios'

import i18n from '@/lib/i18n'
import { normalizeApiError } from '@/lib/api/app-error'

let unauthorizedHandler = null
let accessTokenResolver = null

function getLocaleFromPath(pathname = '') {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ar'
}

function resolveRequestLocale() {
  if (typeof window !== 'undefined') {
    return getLocaleFromPath(window.location.pathname)
  }

  return i18n?.resolvedLanguage || i18n?.language || 'en'
}

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export function registerAccessTokenResolver(resolver) {
  accessTokenResolver = resolver
}

export const httpClient = axios.create({
  baseURL: (
    import.meta.env.VITE_API_BASE_URL ||
    'https://aqarinn.apphub.my.id/api/admin'
  ).trim(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': resolveRequestLocale(),
    locale: resolveRequestLocale(),
  },
})

httpClient.interceptors.request.use((config) => {
  const accessToken = accessTokenResolver?.()
  const currentLocale = resolveRequestLocale()

  config.headers = config.headers ?? {}

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  config.headers['Accept-Language'] = currentLocale
  config.headers.locale = currentLocale
  config.headers['X-App-Client'] = 'aqarinn-backoffice'
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeApiError(error)

    if (normalizedError.status === 401 && unauthorizedHandler) {
      unauthorizedHandler(normalizedError)
    }

    return Promise.reject(normalizedError)
  },
)
