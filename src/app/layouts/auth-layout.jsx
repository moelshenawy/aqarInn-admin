import { Building2, Globe2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { useAuth } from '@/features/auth/context/auth-provider'
import { LanguageSwitcher } from '@/shared/components/language-switcher'

export function AuthLayout() {
  const { t } = useTranslation(['auth', 'common'])
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.dashboard} replace />
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px] opacity-50" />
      <div className="relative grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2rem] border border-white/60 bg-slate-950 p-10 text-white shadow-2xl shadow-slate-950/15 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <Building2 className="size-4" />
              {t('common:appName')}
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight">
                {t('auth:welcomeTitle')}
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300">
                {t('auth:welcomeDescription')}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">
                {t('auth:foundationCardOne.title')}
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                {t('auth:foundationCardOne.description')}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">
                {t('auth:foundationCardTwo.title')}
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                {t('auth:foundationCardTwo.description')}
              </p>
            </div>
          </div>
        </section>
        <section className="relative rounded-[2rem] border border-slate-200/70 bg-white/90 p-5 shadow-xl shadow-slate-200/50 backdrop-blur sm:p-8">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
                <Building2 className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-950">
                  {t('common:appName')}
                </p>
                <p className="text-sm text-slate-500">
                  {t('auth:backofficeLabel')}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
              <Globe2 className="size-4 text-slate-500" />
              <LanguageSwitcher compact />
            </div>
          </div>
          <Outlet />
        </section>
      </div>
    </div>
  )
}
