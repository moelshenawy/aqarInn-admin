import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, CircleAlert, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AuthCard } from '@/features/auth/components/auth-card'
import { AuthField } from '@/features/auth/components/auth-field'
import { AuthPrimaryButton } from '@/features/auth/components/auth-primary-button'
import { FORGOT_PASSWORD_CONTENT } from '@/features/auth/constants/auth-ui'
import { forgotPasswordSchema } from '@/features/auth/schemas/auth-form-schemas'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = handleSubmit(() => {
    navigate(ROUTE_PATHS.resetPassword)
  })

  return (
    <AuthCard variant="compact">
      <form className="flex h-full flex-col" onSubmit={onSubmit} noValidate>
        <div className="flex justify-end">
          <Link
            to={ROUTE_PATHS.login}
            aria-label="العودة لتسجيل الدخول"
            className="flex size-8 items-center justify-center rounded-full border border-[#d6cbb2] text-[#6d4f3b] transition-colors hover:bg-[#efe7d8]"
          >
            <ChevronRight className="size-4 stroke-[1.8]" />
          </Link>
        </div>

        <div className="mt-6 space-y-3 text-right">
          <h2 className="text-[30px] leading-[38px] font-semibold text-[#402f28]">
            {FORGOT_PASSWORD_CONTENT.title}
          </h2>
          <p className="text-[20px] leading-[30px] font-medium text-[#414651]">
            {FORGOT_PASSWORD_CONTENT.description}
          </p>
        </div>

        <div className="mt-[46px]">
          <AuthField
            label={FORGOT_PASSWORD_CONTENT.emailLabel}
            placeholder={FORGOT_PASSWORD_CONTENT.emailPlaceholder}
            trailingIcon={Mail}
            leadingIcon={errors.email ? CircleAlert : undefined}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <AuthPrimaryButton className="mt-auto">
          {FORGOT_PASSWORD_CONTENT.submit}
        </AuthPrimaryButton>
      </form>
    </AuthCard>
  )
}
