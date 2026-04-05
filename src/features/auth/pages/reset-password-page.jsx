import { zodResolver } from '@hookform/resolvers/zod'
import { EyeOff, KeyRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AuthCard } from '@/features/auth/components/auth-card'
import { AuthField } from '@/features/auth/components/auth-field'
import { AuthPrimaryButton } from '@/features/auth/components/auth-primary-button'
import { RESET_PASSWORD_CONTENT } from '@/features/auth/constants/auth-ui'
import { resetPasswordSchema } from '@/features/auth/schemas/auth-form-schemas'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = handleSubmit(() => {
    navigate(ROUTE_PATHS.login)
  })

  return (
    <AuthCard variant="compact">
      <form className="flex h-full flex-col" onSubmit={onSubmit} noValidate>
        <div className="space-y-3 text-right">
          <h2 className="text-[30px] leading-[38px] font-semibold text-[#402f28]">
            {RESET_PASSWORD_CONTENT.title}
          </h2>
          <p className="text-[20px] leading-[30px] font-medium text-[#414651]">
            {RESET_PASSWORD_CONTENT.description}
          </p>
        </div>

        <div className="mt-[34px] space-y-[9px]">
          <AuthField
            label={RESET_PASSWORD_CONTENT.newPasswordLabel}
            type="password"
            placeholder={RESET_PASSWORD_CONTENT.newPasswordPlaceholder}
            trailingIcon={KeyRound}
            leadingIcon={EyeOff}
            error={errors.password?.message}
            {...register('password')}
          />

          <AuthField
            label={RESET_PASSWORD_CONTENT.confirmPasswordLabel}
            type="password"
            placeholder={RESET_PASSWORD_CONTENT.confirmPasswordPlaceholder}
            trailingIcon={KeyRound}
            leadingIcon={EyeOff}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <AuthPrimaryButton className="mt-auto">
          {RESET_PASSWORD_CONTENT.submit}
        </AuthPrimaryButton>
      </form>
    </AuthCard>
  )
}
