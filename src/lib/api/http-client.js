import axios from 'axios'

import { normalizeApiError } from '@/lib/api/app-error'
import { getSession } from '@/lib/storage/session-storage'

let unauthorizedHandler = null

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': 'en',
  },
})

httpClient.interceptors.request.use((config) => {
  const session = getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
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
