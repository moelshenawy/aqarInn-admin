import { Outlet } from 'react-router-dom'

import { AuthBackground } from '@/features/auth/components/auth-background'
import { AuthBrandPanel } from '@/features/auth/components/auth-brand-panel'

export function AuthLayout() {
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
