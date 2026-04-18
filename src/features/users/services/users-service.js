import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/http-methods'

export function getUsers(params = {}) {
  return apiGet('users', { params })
}

export function getUserById(userId) {
  return apiGet(`users/${userId}`)
}

export function createUser(payload) {
  return apiPost('users', payload)
}

export function updateUser(userId, payload) {
  return apiPut(`users/${userId}`, payload)
}

export function deleteUser(userId) {
  return apiDelete(`users/${userId}`)
}

