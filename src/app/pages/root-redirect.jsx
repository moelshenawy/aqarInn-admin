import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { OnboardingScreen } from '@/features/auth/components/onboarding-screen'
import { ONBOARDING_SEEN_STORAGE_KEY } from '@/features/auth/constants/auth-ui'

export function RootRedirectPage() {
  const navigate = useNavigate()
  const [showOnboarding] = useState(() => {
    return window.localStorage.getItem(ONBOARDING_SEEN_STORAGE_KEY) !== 'true'
  })

  useEffect(() => {
    if (!showOnboarding) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
      navigate(ROUTE_PATHS.login, { replace: true })
    }, 5000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [navigate, showOnboarding])

  if (!showOnboarding) {
    return <Navigate to={ROUTE_PATHS.login} replace />
  }

  return <OnboardingScreen />
}
