import axios from 'axios'

import { normalizeApiError } from '@/lib/api/app-error'

let unauthorizedHandler = null
let accessTokenResolver = null

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export function registerAccessTokenResolver(resolver) {
  accessTokenResolver = resolver
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': 'en',
  },
})

httpClient.interceptors.request.use((config) => {
  const accessToken = accessTokenResolver?.()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

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
