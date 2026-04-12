import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
import { createResetPasswordSchema } from '@/features/auth/schemas/auth-form-schemas'
import * as authService from '@/features/auth/services/auth-service'
import { getLocalizedAuthErrorMessage } from '@/features/auth/utils/auth-error-message'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation('auth')
  const resetPasswordSchema = useMemo(() => createResetPasswordSchema(t), [t])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const hasHandledMissingEmail = useRef(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const emailFromQuery = searchParams.get('email')?.trim() || ''
  const emailFromStorage =
    typeof window !== 'undefined'
      ? sessionStorage.getItem(AUTH_RESET_PASSWORD_EMAIL_STORAGE_KEY)?.trim() ||
        ''
      : ''
  const resetEmail = emailFromQuery || emailFromStorage

  useEffect(() => {
    if (!emailFromQuery) {
      return
    }

    try {
      sessionStorage.setItem(
        AUTH_RESET_PASSWORD_EMAIL_STORAGE_KEY,
        emailFromQuery,
      )
    } catch {
      // ignore storage errors
    }
  }, [emailFromQuery])

  useEffect(() => {
    if (resetEmail || hasHandledMissingEmail.current) {
      return
    }

    hasHandledMissingEmail.current = true
    showDashboardErrorToast({
      title: t('resetPasswordFailed'),
      description: t('resetPasswordEmailMissing'),
    })
    navigate(ROUTE_PATHS.forgotPassword, { replace: true })
  }, [navigate, resetEmail, t])

  const onSubmit = handleSubmit(async ({ password }) => {
    if (!resetEmail) {
      showDashboardErrorToast({
        title: t('resetPasswordFailed'),
        description: t('resetPasswordEmailMissing'),
      })
      navigate(ROUTE_PATHS.forgotPassword, { replace: true })
      return
    }

    const loadingToastId = showDashboardLoadingToast({
      title: t('resettingPassword'),
    })

    try {
      await authService.resetPassword({
        email: resetEmail,
        password,
      })

      try {
        sessionStorage.removeItem(AUTH_RESET_PASSWORD_EMAIL_STORAGE_KEY)
      } catch {
        // ignore storage errors
      }

      toast.dismiss(loadingToastId)
      showDashboardSuccessToast({
        title: t('resetPasswordSuccess'),
        description: t('resetPasswordSuccessDescription'),
      })
      navigate(ROUTE_PATHS.login, { replace: true })
    } catch (error) {
      toast.dismiss(loadingToastId)
      showDashboardErrorToast({
        title: t('resetPasswordFailed'),
        description: getLocalizedAuthErrorMessage(error, t),
      })
    }
  })

  return (
    <AuthCard variant="compact">
      <form className="flex h-full flex-col" onSubmit={onSubmit} noValidate>
        <div className="space-y-3 text-right">
          <h2 className="text-[30px] leading-[38px] font-semibold text-[#402f28]">
            {t('resetPasswordTitle')}
          </h2>
          <p className="text-[20px] leading-[30px] font-medium text-[#414651]">
            {t('resetPasswordDescription')}
          </p>
        </div>

        <div className="mt-[34px] space-y-[9px]">
          <AuthField
            label={t('newPasswordLabel')}
            type={showPassword ? 'text' : 'password'}
            placeholder={t('newPasswordPlaceholder')}
            trailingIcon={showPassword ? Eye : EyeOff}
            onTrailingIconClick={() => setShowPassword((current) => !current)}
            trailingIconAriaLabel={
              showPassword ? t('hidePassword') : t('showPassword')
            }
            leadingIcon={KeyRound}
            error={errors.password?.message}
            {...register('password')}
          />

          <AuthField
            label={t('confirmPasswordLabel')}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('confirmPasswordPlaceholder')}
            trailingIcon={showConfirmPassword ? Eye : EyeOff}
            onTrailingIconClick={() =>
              setShowConfirmPassword((current) => !current)
            }
            trailingIconAriaLabel={
              showConfirmPassword ? t('hidePassword') : t('showPassword')
            }
            leadingIcon={KeyRound}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <AuthPrimaryButton className="mt-auto" disabled={isSubmitting}>
          {t('resetPasswordSubmit')}
        </AuthPrimaryButton>
      </form>
    </AuthCard>
  )
}
