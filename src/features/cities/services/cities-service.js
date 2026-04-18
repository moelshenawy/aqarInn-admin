import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/http-methods'

export function getCities(page = 1) {
  return apiGet('cities', { params: { page } })
}

export function createCity(payload, config) {
  return apiPost('cities', payload, config)
}

export function updateCity(cityId, payload, config) {
  return apiPut(`cities/${cityId}`, payload, config)
}

export function deleteCity(cityId) {
  return apiDelete(`cities/${cityId}`)
}
