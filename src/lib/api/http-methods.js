import { httpClient } from '@/lib/api/http-client'

export function apiGet(url, config = {}) {
  return httpClient.get(url, config).then((response) => response.data)
}

export function apiPost(url, payload, config = {}) {
  return httpClient.post(url, payload, config).then((response) => response.data)
}

export function apiPut(url, payload, config = {}) {
  return httpClient.put(url, payload, config).then((response) => response.data)
}

export function apiPatch(url, payload, config = {}) {
  return httpClient
    .patch(url, payload, config)
    .then((response) => response.data)
}

export function apiDelete(url, config = {}) {
  return httpClient.delete(url, config).then((response) => response.data)
}
