import { fireEvent, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import UsersAddPage from '@/features/users/pages/users-add-page'
import UsersPage from '@/features/users/pages/users-page'
import {
  usersAddRouteMeta,
  usersRouteMeta,
} from '@/features/users/routes/users.route'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'

function renderUsersRoute({ initialEntries = [ROUTE_PATHS.users] } = {}) {
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
          {
            path: 'users/add',
            element: <UsersAddPage />,
            handle: usersAddRouteMeta,
          },
        ],
      },
    ],
    {
      initialEntries,
    },
  )

  const renderResult = render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <AppDirectionProvider>
          <RouterProvider router={router} />
          <Toaster richColors closeButton />
        </AppDirectionProvider>
      </AuthProvider>
    </I18nextProvider>,
  )

  return { router, ...renderResult }
}

describe('UsersPage route', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

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

  it('navigates to the add user page from the users table action', () => {
    const { router } = renderUsersRoute()

    fireEvent.click(screen.getByRole('button', { name: 'اضافة مستخدم' }))

    expect(router.state.location.pathname).toBe(ROUTE_PATHS.usersAdd)
    expect(
      screen.getByRole('heading', { name: 'إضافة مستخدم جديد' }),
    ).toBeInTheDocument()
    expect(screen.getByText('المستخدمين')).toBeInTheDocument()
    expect(screen.getByText('قم بإكمال الحقول المطلوبة لإضافة مستخدم جديد إلى النظام')).toBeInTheDocument()

    expect(screen.getByLabelText(/الاسم الكامل بالإنجليزية/)).toBeInTheDocument()
    expect(screen.getByLabelText(/الاسم الكامل بالعربية/)).toBeInTheDocument()
    expect(screen.getByLabelText(/البريد الإلكتروني/)).toBeInTheDocument()
    expect(screen.getByLabelText(/رقم الجوال/)).toBeInTheDocument()
    expect(screen.getByLabelText(/الدور/)).toBeInTheDocument()
    expect(screen.getByLabelText(/الحالة/)).toBeInTheDocument()
    expect(screen.getByLabelText(/قائمة الفرص الاستثمارية/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'اضافة المستخدم' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'الغاء' })).toBeInTheDocument()
  })

  it('submits the add user happy path locally and shows the success toast', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const { router } = renderUsersRoute({
      initialEntries: [ROUTE_PATHS.usersAdd],
    })

    fireEvent.change(screen.getByLabelText(/الاسم الكامل بالإنجليزية/), {
      target: { value: 'Sara Ahmed Alhashmi' },
    })
    fireEvent.change(screen.getByLabelText(/الاسم الكامل بالعربية/), {
      target: { value: 'سارة أحمد سالم الهاشمي' },
    })
    fireEvent.change(screen.getByLabelText(/البريد الإلكتروني/), {
      target: { value: 'sara@AqarInn' },
    })
    fireEvent.change(screen.getByLabelText(/رقم الجوال/), {
      target: { value: '+966 55 555 5555' },
    })
    fireEvent.change(screen.getByLabelText(/الدور/), {
      target: { value: 'operations-manager' },
    })
    fireEvent.click(screen.getByLabelText(/الحالة/))
    fireEvent.change(screen.getByLabelText(/قائمة الفرص الاستثمارية/), {
      target: { value: 'investment-riyadh-001' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'اضافة المستخدم' }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(router.state.location.pathname).toBe(ROUTE_PATHS.users)
    expect(
      await screen.findByText('تم اضافة المستخدم بنجاح'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'تمت إضافة المستخدم إلى النظام بنجاح، ويمكنك الآن إدارة صلاحياته ومتابعة نشاطه',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'اغلاق' })).toBeInTheDocument()
  })

  it('cancels add user without showing a success toast', () => {
    const { router } = renderUsersRoute({
      initialEntries: [ROUTE_PATHS.usersAdd],
    })

    fireEvent.click(screen.getByRole('button', { name: 'الغاء' }))

    expect(router.state.location.pathname).toBe(ROUTE_PATHS.users)
    expect(
      screen.queryByText('تم اضافة المستخدم بنجاح'),
    ).not.toBeInTheDocument()
  })
})
