import { apiPost } from '@/lib/api/http-methods'

export async function login(payload) {
  // POST to `${VITE_API_BASE_URL}/auth/login`
  return apiPost('auth/login', payload)
}

export async function logout(accessToken) {
  // POST to `${VITE_API_BASE_URL}/auth/logout`
  // send empty body; axios will include Authorization header via http-client resolver
  return apiPost(
    'auth/logout',
    {},
    {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
  )
}

export default {
  login,
  logout,
}
