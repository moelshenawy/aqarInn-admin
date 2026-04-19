import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/http-methods'

export function getUsers(params = {}) {
  return apiGet('admin-users', { params })
}

export function createUser(payload) {
  return apiPost('admin-users', payload)
}

export function updateUser(userId, payload) {
  return apiPut(`admin-users/${userId}`, payload)
}

export function deleteUser(userId) {
  return apiDelete(`admin-users/${userId}`)
}

