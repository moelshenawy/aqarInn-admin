import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, CircleAlert, Mail } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { LocalizedLink } from '@/shared/components/localized-link'
import { toast } from 'sonner'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import {
  showDashboardErrorToast,
  showDashboardLoadingToast,
  showDashboardSuccessToast,
} from '@/components/ui/dashboard-toast'
import { AuthCard } from '@/features/auth/components/auth-card'
import { AuthField } from '@/features/auth/components/auth-field'
import { AuthPrimaryButton } from '@/features/auth/components/auth-primary-button'
import { AUTH_RESET_PASSWORD_EMAIL_STORAGE_KEY } from '@/features/auth/constants/auth-storage'
import { createForgotPasswordSchema } from '@/features/auth/schemas/auth-form-schemas'
import * as authService from '@/features/auth/services/auth-service'
import { getLocalizedAuthErrorMessage } from '@/features/auth/utils/auth-error-message'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('auth')
  const forgotPasswordSchema = useMemo(() => createForgotPasswordSchema(t), [t])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = handleSubmit(async ({ email }) => {
    const loadingToastId = showDashboardLoadingToast({
      title: t('sendingResetLink'),
    })

    try {
      await authService.forgotPassword({ email })

      try {
        sessionStorage.setItem(AUTH_RESET_PASSWORD_EMAIL_STORAGE_KEY, email)
      } catch {
        // ignore storage errors
      }

      toast.dismiss(loadingToastId)
      showDashboardSuccessToast({
        title: t('forgotPasswordSuccessTitle'),
        description: t('forgotPasswordSuccessDescription'),
      })

      navigate(
        `${ROUTE_PATHS.withLocale(ROUTE_PATHS.resetPassword, i18n.resolvedLanguage)}?email=${encodeURIComponent(email)}`,
      )
    } catch (error) {
      toast.dismiss(loadingToastId)
      showDashboardErrorToast({
        title: t('forgotPasswordFailed'),
        description: getLocalizedAuthErrorMessage(error, t),
      })
    }
  })

  return (
    <AuthCard variant="compact">
      <form className="flex h-full flex-col" onSubmit={onSubmit} noValidate>
        <div className="flex justify-start">
          <LocalizedLink
            to={ROUTE_PATHS.login}
            aria-label={t('goBackToLogin')}
            className="flex size-8 items-center justify-center rounded-full border border-[#d6cbb2] text-[#6d4f3b] transition-colors hover:bg-[#efe7d8]"
          >
            <ChevronRight className="size-4 stroke-[1.8]" />
          </LocalizedLink>
        </div>

        <div className="mt-6 space-y-3 text-right">
          <h2 className="text-[30px] leading-[38px] font-semibold text-[#402f28]">
            {t('forgotPasswordTitle')}
          </h2>
          <p className="text-[20px] leading-[30px] font-medium text-[#414651]">
            {t('forgotPasswordDescription')}
          </p>
        </div>

        <div className="mt-[46px]">
          <AuthField
            label={t('email')}
            placeholder={t('emailPlaceholder')}
            trailingIcon={Mail}
            leadingIcon={errors.email ? CircleAlert : undefined}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <AuthPrimaryButton className="mt-auto" disabled={isSubmitting}>
          {t('sendResetLink')}
        </AuthPrimaryButton>
      </form>
    </AuthCard>
  )
}
