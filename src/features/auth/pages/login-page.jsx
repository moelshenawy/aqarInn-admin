import { useMemo } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { useAuth } from '@/features/auth/context/auth-provider'
import { createLoginSchema } from '@/features/auth/schemas/login-schema'
import { createZodErrorMap } from '@/lib/forms/zod-error-map'
import { APP_ROLES } from '@/lib/permissions/constants'
import { AppButton } from '@/shared/components/app-button'
import { AppFormField } from '@/shared/components/app-form-field'

const ROLE_OPTIONS = Object.values(APP_ROLES)

export default function LoginPage() {
  const { t } = useTranslation([
    'auth',
    'validation',
    'permissions',
    'navigation',
  ])
  const navigate = useNavigate()
  const location = useLocation()
  const { signInDemo } = useAuth()

  const schema = useMemo(() => {
    z.setErrorMap(createZodErrorMap(t))
    return createLoginSchema(t)
  }, [t])

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'ops-admin@aqarinn.sa',
      password: 'Password@1',
      role: APP_ROLES.operationsAdmin,
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    signInDemo(values)
    toast.success(t('auth:signedInSuccess'))
    navigate(location.state?.from?.pathname ?? ROUTE_PATHS.dashboard, {
      replace: true,
    })
  })

  return (
    <Card className="border-border/70 bg-white/90 shadow-none">
      <CardHeader className="space-y-3 px-0 pt-0">
        <CardTitle className="text-foreground text-2xl font-semibold tracking-tight">
          {t('auth:loginTitle')}
        </CardTitle>
        <p className="text-muted-foreground text-sm leading-6">
          {t('auth:loginDescription')}
        </p>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <AppFormField
            control={form.control}
            name="email"
            label={t('auth:email')}
            placeholder={t('auth:emailPlaceholder')}
            autoComplete="email"
            dir="ltr"
          />
          <AppFormField
            control={form.control}
            name="password"
            type="password"
            label={t('auth:password')}
            placeholder={t('auth:passwordPlaceholder')}
            autoComplete="current-password"
            dir="ltr"
          />
          <AppFormField
            control={form.control}
            name="role"
            label={t('auth:role')}
            render={({ field, inputClassName, messageId }) => (
              <select
                {...field}
                aria-describedby={messageId}
                className={inputClassName}
              >
                <option value="">{t('auth:rolePlaceholder')}</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {t(`permissions:roles.${role}`)}
                  </option>
                ))}
              </select>
            )}
          />
          <div className="border-border bg-muted/40 text-muted-foreground rounded-2xl border border-dashed p-4 text-sm leading-6">
            {t('auth:demoSignInHint')}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AppButton
              type="submit"
              className="w-full sm:w-auto"
              disabled={form.formState.isSubmitting}
            >
              {t('auth:signIn')}
            </AppButton>
            <AppButton asChild variant="ghost" className="w-full sm:w-auto">
              <Link to={ROUTE_PATHS.forgotPassword}>
                {t('navigation:forgotPassword')}
              </Link>
            </AppButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
