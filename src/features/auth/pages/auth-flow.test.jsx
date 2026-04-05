import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthLayout } from '@/app/layouts/auth-layout'
import { RootRedirectPage } from '@/app/pages/root-redirect'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import { ONBOARDING_SEEN_STORAGE_KEY } from '@/features/auth/constants/auth-ui'
import ForgotPasswordPage from '@/features/auth/pages/forgot-password-page'
import LoginPage from '@/features/auth/pages/login-page'
import ResetPasswordPage from '@/features/auth/pages/reset-password-page'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/language'

function renderAuthRouter(initialEntries = ['/']) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'ar')

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
        </AppDirectionProvider>
      </AuthProvider>
    </I18nextProvider>,
  )
}

describe('Auth flow routes', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
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
      await screen.findByText('عذراً، البريد الإلكتروني غير صحيح'),
    ).toBeInTheDocument()
  })

  it('shows required field errors on empty login submit', async () => {
    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
    renderAuthRouter([ROUTE_PATHS.login])

    fireEvent.click(screen.getByRole('button', { name: 'تسجيل الدخول' }))

    expect(await screen.findByText('البريد الالكتروني مطلوب')).toBeInTheDocument()
    expect(screen.getByText('كلمة المرور مطلوبة')).toBeInTheDocument()
  })

  it('renders forgot password and validates the email field', async () => {
    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
    renderAuthRouter([ROUTE_PATHS.forgotPassword])

    expect(
      await screen.findByText('اعادة تعيين كلمة السر'),
    ).toBeInTheDocument()

    fireEvent.change(
      screen.getByPlaceholderText('ادخل البريد الالكتروني الخاص بك'),
      {
        target: { value: 'invalid-email' },
      },
    )
    fireEvent.click(screen.getByRole('button', { name: 'ارسال' }))

    expect(
      await screen.findByText('عذراً، البريد الإلكتروني غير صحيح'),
    ).toBeInTheDocument()
  })

  it('renders reset password and validates mismatched passwords', async () => {
    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true')
    renderAuthRouter([ROUTE_PATHS.resetPassword])

    expect(
      await screen.findByText('قم بكتابة كلمة السر الجديدة الخاصة بك'),
    ).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('ادخل كلمة المرور الجديدة'), {
      target: { value: '12345678' },
    })
    fireEvent.change(screen.getByPlaceholderText('تأكيد كلمة المرور'), {
      target: { value: '87654321' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'اعادة تعيين' }))

    expect(await screen.findByText('كلمة المرور غير متطابقة')).toBeInTheDocument()
  })
})
