import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, EyeOff, KeyRound, Mail, Eye, Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { LocalizedLink } from '@/shared/components/localized-link'
import { toast } from 'sonner'

import { useTranslation } from 'react-i18next'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AuthCard } from '@/features/auth/components/auth-card'
import { AuthField } from '@/features/auth/components/auth-field'
import { AuthPrimaryButton } from '@/features/auth/components/auth-primary-button'
// Using translation keys instead of static UI constants
import { createLoginFormSchema } from '@/features/auth/schemas/auth-form-schemas'
import { useAuth } from '@/features/auth/context/auth-provider'
import * as authService from '@/features/auth/services/auth-service'
import { getLocalizedAuthErrorMessage } from '@/features/auth/utils/auth-error-message'
import {
  showDashboardSuccessToast,
  showDashboardErrorToast,
  showDashboardLoadingToast,
} from '@/components/ui/dashboard-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('auth')
  const auth = useAuth()
  const loginFormSchema = useMemo(() => createLoginFormSchema(t), [t])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: localStorage.getItem('rememberedEmail') || '',
      password: '',
      remember: Boolean(localStorage.getItem('rememberedEmail')),
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    const { email, password, remember } = values

    const loadingId = showDashboardLoadingToast({ title: t('loggingIn') })

    try {
      const resp = await authService.login({ email, password })

      const token = resp?.data?.token
      const authUser = resp?.data?.admin ?? resp?.data?.user ?? resp?.data

      if (!token) {
        throw new Error('validation.unexpectedError')
      }

      try {
        localStorage.setItem('authToken', token)
        localStorage.setItem('authUser', JSON.stringify(authUser))
      } catch {
        // ignore storage errors
      }

      if (remember) {
        try {
          localStorage.setItem('rememberedEmail', email)
        } catch {
          // ignore storage errors
        }
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      auth.login({ token, admin: authUser })

      toast.dismiss(loadingId)
      showDashboardSuccessToast({ title: t('loginSuccess') })

      navigate(
        ROUTE_PATHS.withLocale(ROUTE_PATHS.dashboard, i18n.resolvedLanguage),
      )
    } catch (err) {
      toast.dismiss(loadingId)
      const description = getLocalizedAuthErrorMessage(err, t)
      showDashboardErrorToast({ title: t('loginFailed'), description })
    }
  })

  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthCard variant="login">
      <div className="space-y-[34px] text-start">
        <div className="space-y-3">
          <h2 className="text-[30px] leading-[38px] font-semibold text-[#402f28]">
            {t('loginPage.title')}
          </h2>
          <p className="text-[20px] leading-[30px] font-medium text-[#414651]">
            {t('loginPage.description')}
          </p>
        </div>

        <form className="space-y-[9px]" onSubmit={onSubmit} noValidate>
          <AuthField
            label={t('loginPage.emailLabel')}
            placeholder={t('loginPage.emailPlaceholder')}
            trailingIcon={Mail}
            leadingIcon={errors.email ? CircleAlert : undefined}
            error={errors.email?.message}
            {...register('email')}
          />

          <AuthField
            label={t('loginPage.passwordLabel')}
            type={showPassword ? 'text' : 'password'}
            placeholder={t('loginPage.passwordPlaceholder')}
            trailingIcon={showPassword ? Eye : EyeOff}
            onTrailingIconClick={() => setShowPassword((s) => !s)}
            trailingIconAriaLabel={
              showPassword ? t('hidePassword') : t('showPassword')
            }
            leadingIcon={KeyRound}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 py-1 text-[#876647]">
            <LocalizedLink
              to={ROUTE_PATHS.forgotPassword}
              className="text-base leading-6 font-medium transition-opacity hover:opacity-85"
            >
              {t('loginPage.forgotPassword')}
            </LocalizedLink>

            <label className="flex cursor-pointer items-center gap-[10px] text-base leading-6 font-medium">
              <span>{t('loginPage.rememberMe')}</span>

              <span className="relative inline-flex size-[22px] shrink-0 items-center justify-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  {...register('remember')}
                />

                <span
                  className="pointer-events-none inline-block size-[22px] rounded-[6px] border border-[#d6cbb2] bg-transparent transition peer-checked:border-[#402f28] peer-checked:bg-[#402f28]"
                  aria-hidden="true"
                />

                <Check
                  className="pointer-events-none absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition peer-checked:opacity-100"
                  aria-hidden="true"
                />
              </span>
            </label>
          </div>

          <AuthPrimaryButton className="mt-[17px]" disabled={isSubmitting}>
            {t('loginPage.submit')}
          </AuthPrimaryButton>
        </form>
      </div>
    </AuthCard>
  )
}
