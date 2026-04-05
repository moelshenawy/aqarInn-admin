import { AuthBackground } from '@/features/auth/components/auth-background'
import { AUTH_LOGO_SRC } from '@/features/auth/constants/auth-ui'

export function OnboardingScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f3e8]">
      <AuthBackground className="opacity-70" />
      <div className="container auth-onboarding-center relative">
        <img src={AUTH_LOGO_SRC} alt="Aqar Inn logo" className="auth-onboarding-logo" />
      </div>
    </div>
  )
}
