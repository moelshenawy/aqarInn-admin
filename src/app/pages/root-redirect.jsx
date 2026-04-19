import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'

import { OnboardingScreen } from '@/features/auth/components/onboarding-screen'
import { ONBOARDING_SEEN_STORAGE_KEY } from '@/features/auth/constants/auth-ui'
import { getLocaleFromPath } from '@/lib/i18n/language'

export function RootRedirectPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showOnboarding] = useState(() => {
    return window.localStorage.getItem(ONBOARDING_SEEN_STORAGE_KEY) !== 'true'
  })

  // Detect locale from URL and redirect if needed
  useEffect(() => {
    const { pathname } = location
    // Only allow / or /en as root
    if (pathname !== '/' && pathname !== '/en') {
      // Unknown root, redirect to default
      navigate('/', { replace: true })
      return
    }
  }, [location, navigate])

  useEffect(() => {
    if (!showOnboarding) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
      // Redirect to login with correct locale prefix
      const locale = getLocaleFromPath(location.pathname)
      if (locale === 'en') {
        navigate('/en/login', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }, 5000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [navigate, showOnboarding, location])

  if (!showOnboarding) {
    // Redirect to login with correct locale prefix
    const locale = getLocaleFromPath(location.pathname)
    if (locale === 'en') {
      return <Navigate to="/en/login" replace />
    }
    return <Navigate to="/login" replace />
  }

  return <OnboardingScreen />
}
