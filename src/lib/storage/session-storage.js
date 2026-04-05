const SESSION_STORAGE_KEY = 'aqarinn.backoffice.session'

export function getSession() {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    clearSession()
    return null
  }
}

export function setSession(session) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
  }
}
