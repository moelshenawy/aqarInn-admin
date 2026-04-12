import { act } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthLayout } from '@/app/layouts/auth-layout'
import { RootRedirectPage } from '@/app/pages/root-redirect'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import { AUTH_RESET_PASSWORD_EMAIL_STORAGE_KEY } from '@/features/auth/constants/auth-storage'
import { ONBOARDING_SEEN_STORAGE_KEY } from '@/features/auth/constants/auth-ui'
import ForgotPasswordPage from '@/features/auth/pages/forgot-password-page'
import LoginPage from '@/features/auth/pages/login-page'
import ResetPasswordPage from '@/features/auth/pages/reset-password-page'
import * as authService from '@/features/auth/services/auth-service'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/language'

function renderAuthRouter(initialEntries = ['/']) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <RootRedirectPage /> },
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTE_PATHS.login, element: <LoginPage /> },
          {
            path: ROUTE_PATHS.forgotPassword,
            element: <ForgotPasswordPage />,
          },
          { path: ROUTE_PATHS.resetPassword, element: <ResetPasswordPage /> },
        ],
      },
      {
        path: ROUTE_PATHS.dashboard,
        element: <div>لوحة المعلومات</div>,
      },
    ],
    { initialEntries },
  )

  return render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <AppDirectionProvider>
          <RouterProvider router={router} />
          <Toaster richColors closeButton />
        </AppDirectionProvider>
      </AuthProvider>
    </I18nextProvider>,
  )
}

describe('Auth flow routes', () => {
  beforeEach(async () => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'ar')
    await i18n.changeLanguage('ar')
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows onboarding on first visit then redirects to login after five seconds', async () => {
    vi.useFakeTimers()
    renderAuthRouter()

    expect(screen.getByAltText('Aqar Inn logo')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(5000)
      await Promise.resolve()
    })

    expect(screen.getByText('مرحبا بعودتك!')).toBeInTheDocument()
    expect(window.localStorage.getItem(ONBOARDING_SEEN_STORAGE_KEY)).toBe(
      'true',
    )
  })

  it('skips onboarding after it has already been seen', async () => {
    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')

    renderAuthRouter()

    expect(await screen.findByText('مرحبا بعودتك!')).toBeInTheDocument()
    expect(screen.queryByAltText('Aqar Inn logo')).not.toBeInTheDocument()
  })

  it('renders the auth shell decorative language control on login', async () => {
    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
    renderAuthRouter([ROUTE_PATHS.login])

    expect(await screen.findByText('EN')).toBeInTheDocument()
    expect(screen.getByText(/عقار ان موثوق/)).toBeInTheDocument()
  })

  it('shows the invalid email state inside login', async () => {
    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
    renderAuthRouter([ROUTE_PATHS.login])

    fireEvent.change(
      screen.getByPlaceholderText('ادخل البريد الالكتروني الخاص بك'),
      {
        target: { value: 'invalid-email' },
      },
    )
    fireEvent.change(screen.getByPlaceholderText('ادخل كلمة المرور'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'تسجيل الدخول' }))

    expect(
      await screen.findByText('أدخل بريدًا إلكترونيًا صحيحًا.'),
    ).toBeInTheDocument()
  })

  it('shows required field errors on empty login submit', async () => {
    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
    renderAuthRouter([ROUTE_PATHS.login])

    fireEvent.click(screen.getByRole('button', { name: 'تسجيل الدخول' }))

    expect(
      await screen.findByText('البريد الإلكتروني مطلوب.'),
    ).toBeInTheDocument()
    expect(screen.getByText('كلمة المرور مطلوبة.')).toBeInTheDocument()
  })

  it('validates the email field on forgot password', async () => {
    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
    renderAuthRouter([ROUTE_PATHS.forgotPassword])

    expect(
      await screen.findByRole('heading', { name: 'هل نسيت كلمة المرور؟' }),
    ).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('أدخل بريدك الإلكتروني'), {
      target: { value: 'invalid-email' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: 'إرسال رابط إعادة التعيين' }),
    )

    expect(
      await screen.findByText('أدخل بريدًا إلكترونيًا صحيحًا.'),
    ).toBeInTheDocument()
  })

  it('submits forgot password and moves to the reset page with the email context', async () => {
    vi.spyOn(authService, 'forgotPassword').mockResolvedValue({
      message: 'Reset password email dispatched (stub).',
      data: null,
    })

    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
    renderAuthRouter([ROUTE_PATHS.forgotPassword])

    fireEvent.change(screen.getByPlaceholderText('أدخل بريدك الإلكتروني'), {
      target: { value: 'admin@example.com' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: 'إرسال رابط إعادة التعيين' }),
    )

    await waitFor(() => {
      expect(authService.forgotPassword).toHaveBeenCalledWith({
        email: 'admin@example.com',
      })
    })

    expect(
      await screen.findByRole('heading', { name: 'إعادة تعيين كلمة المرور' }),
    ).toBeInTheDocument()
    expect(
      window.sessionStorage.getItem(AUTH_RESET_PASSWORD_EMAIL_STORAGE_KEY),
    ).toBe('admin@example.com')
  })

  it('validates the reset password policy and matching confirmation', async () => {
    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
    renderAuthRouter([`${ROUTE_PATHS.resetPassword}?email=admin@example.com`])

    expect(
      await screen.findByRole('heading', { name: 'إعادة تعيين كلمة المرور' }),
    ).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('أدخل كلمة المرور الجديدة'), {
      target: { value: 'newpass@1234' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('أعد إدخال كلمة المرور الجديدة'),
      {
        target: { value: 'Different@1234' },
      },
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'إعادة تعيين كلمة المرور' }),
    )

    expect(
      await screen.findByText(
        'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل.',
      ),
    ).toBeInTheDocument()
    expect(
      await screen.findByText('كلمتا المرور غير متطابقتين.'),
    ).toBeInTheDocument()
  })

  it('submits reset password and redirects to login', async () => {
    vi.spyOn(authService, 'resetPassword').mockResolvedValue({
      message: 'Password reset successful.',
      data: null,
    })

    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
    renderAuthRouter([`${ROUTE_PATHS.resetPassword}?email=admin@example.com`])

    fireEvent.change(screen.getByPlaceholderText('أدخل كلمة المرور الجديدة'), {
      target: { value: 'NewPass@1234' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('أعد إدخال كلمة المرور الجديدة'),
      {
        target: { value: 'NewPass@1234' },
      },
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'إعادة تعيين كلمة المرور' }),
    )

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'NewPass@1234',
      })
    })

    expect(await screen.findByText('مرحبا بعودتك!')).toBeInTheDocument()
    expect(
      window.sessionStorage.getItem(AUTH_RESET_PASSWORD_EMAIL_STORAGE_KEY),
    ).toBeNull()
  })
})
