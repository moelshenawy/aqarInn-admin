import { fireEvent, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import UsersPage from '@/features/users/pages/users-page'
import { usersRouteMeta } from '@/features/users/routes/users.route'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'

function renderUsersRoute() {
  window.localStorage.setItem('aqarinn.backoffice.language', 'ar')

  const router = createMemoryRouter(
    [
      {
        path: '/app',
        element: <DashboardLayout />,
        children: [
          {
            path: 'users',
            element: <UsersPage />,
            handle: usersRouteMeta,
          },
        ],
      },
    ],
    {
      initialEntries: [ROUTE_PATHS.users],
    },
  )

  const renderResult = render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <AppDirectionProvider>
          <RouterProvider router={router} />
        </AppDirectionProvider>
      </AuthProvider>
    </I18nextProvider>,
  )

  return { router, ...renderResult }
}

describe('UsersPage route', () => {
  it('renders the users management mock table with pagination', () => {
    const { router } = renderUsersRoute()

    expect(router.state.location.pathname).toBe(ROUTE_PATHS.users)
    expect(
      screen.getByRole('heading', { name: 'جميع المستخدمين' }),
    ).toBeInTheDocument()
    expect(screen.getByText('100 مستخدم')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'اضافة مستخدم' }),
    ).toBeInTheDocument()

    expect(screen.getByText('الاسم بالكامل')).toBeInTheDocument()
    expect(screen.getByText('الرقم التعريفي')).toBeInTheDocument()
    expect(screen.getByText('الدور الوظيفي')).toBeInTheDocument()
    expect(
      screen.getByText('عنوان البريد الإلكتروني'),
    ).toBeInTheDocument()
    expect(screen.getByText('رقم الهاتف')).toBeInTheDocument()
    expect(screen.getByText('الحالة')).toBeInTheDocument()

    expect(
      screen.getByText('عبد العزيز أحمد سالم الهاشمي'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('AQIN001')).not.toHaveLength(0)
    expect(screen.getByText('مدير العمليات')).toBeInTheDocument()
    expect(screen.getAllByText('phoenix@AqarInn')).not.toHaveLength(0)
    expect(screen.getAllByText('+966 55 555 5555')).not.toHaveLength(0)
    expect(screen.getAllByText('نشط')).not.toHaveLength(0)

    const firstRowCheckbox = screen.getByLabelText(
      'تحديد المستخدم عبد العزيز أحمد سالم الهاشمي',
    )
    fireEvent.click(firstRowCheckbox)
    expect(firstRowCheckbox).toBeChecked()

    expect(screen.getByRole('button', { name: 'التالي' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'السابق' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { current: 'page', name: '1' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '2' }))

    expect(
      screen.getByText('2').closest('button'),
    ).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('AQIN011')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))

    expect(
      screen.getByText('3').closest('button'),
    ).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('AQIN021')).toBeInTheDocument()
  })
})
