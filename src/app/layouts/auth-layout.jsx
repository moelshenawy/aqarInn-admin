import { Outlet } from 'react-router-dom'

import { AuthBackground } from '@/features/auth/components/auth-background'
import { AuthBrandPanel } from '@/features/auth/components/auth-brand-panel'
import { useSyncLocaleWithPath } from '@/lib/i18n/use-sync-locale-with-path'

export function AuthLayout() {
  useSyncLocaleWithPath()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f3e8]">
      <AuthBackground />
      <div className="container auth-shell">
        <div className="auth-shell-grid">
          <AuthBrandPanel />
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
