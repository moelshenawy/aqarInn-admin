import { apiPost } from '@/lib/api/http-methods'

export async function login(payload) {
  // POST to `${VITE_API_BASE_URL}/auth/login`
  return apiPost('auth/login', payload)
}

export default {
  login,
}
