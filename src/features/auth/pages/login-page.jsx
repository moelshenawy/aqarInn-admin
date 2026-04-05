import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, EyeOff, KeyRound, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AuthCard } from '@/features/auth/components/auth-card'
import { AuthField } from '@/features/auth/components/auth-field'
import { AuthPrimaryButton } from '@/features/auth/components/auth-primary-button'
import { LOGIN_CONTENT } from '@/features/auth/constants/auth-ui'
import { loginFormSchema } from '@/features/auth/schemas/auth-form-schemas'

export default function LoginPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = handleSubmit(() => {
    navigate(ROUTE_PATHS.dashboard)
  })

  return (
    <AuthCard variant="login">
      <div className="space-y-[34px] text-right">
        <div className="space-y-3">
          <h2 className="text-[30px] leading-[38px] font-semibold text-[#402f28]">
            {LOGIN_CONTENT.title}
          </h2>
          <p className="text-[20px] leading-[30px] font-medium text-[#414651]">
            {LOGIN_CONTENT.description}
          </p>
        </div>

        <form className="space-y-[9px]" onSubmit={onSubmit} noValidate>
          <AuthField
            label={LOGIN_CONTENT.emailLabel}
            placeholder={LOGIN_CONTENT.emailPlaceholder}
            trailingIcon={Mail}
            leadingIcon={errors.email ? CircleAlert : undefined}
            error={errors.email?.message}
            {...register('email')}
          />

          <AuthField
            label={LOGIN_CONTENT.passwordLabel}
            type="password"
            placeholder={LOGIN_CONTENT.passwordPlaceholder}
            trailingIcon={KeyRound}
            leadingIcon={EyeOff}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 py-1 text-[#876647]">
            <Link
              to={ROUTE_PATHS.forgotPassword}
              className="text-base leading-6 font-medium transition-opacity hover:opacity-85"
            >
              {LOGIN_CONTENT.forgotPassword}
            </Link>

            <label className="flex items-center gap-[10px] text-base leading-6 font-medium">
              <span>{LOGIN_CONTENT.rememberMe}</span>
              <input
                type="checkbox"
                className="size-[22px] appearance-none rounded-[4px] border border-[#d6cbb2] bg-transparent align-middle checked:border-[#402f28] checked:bg-[#402f28]"
                {...register('remember')}
              />
            </label>
          </div>

          <AuthPrimaryButton className="mt-[17px]">
            {LOGIN_CONTENT.submit}
          </AuthPrimaryButton>
        </form>
      </div>
    </AuthCard>
  )
}
