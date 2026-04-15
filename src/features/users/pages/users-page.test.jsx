import { fireEvent, render, screen, within } from '@testing-library/react'
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
  window.localStorage.setItem('authToken', 'test-auth-token')
  window.localStorage.setItem(
    'authUser',
    JSON.stringify({
      id: 'admin-1',
      email: 'admin@aqarinn.test',
      full_name_ar: 'مدير النظام',
      full_name_en: 'System Admin',
    }),
  )

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
    expect(screen.getByText('عبد العزيز أحمد سالم الهاشمي')).toBeInTheDocument()
  })

  it('opens user details modal on row click and renders activity list', async () => {
    renderUsersRoute()

    fireEvent.click(screen.getByText('عبد العزيز أحمد سالم الهاشمي'))

    const detailsDialog = await screen.findByRole('dialog', {
      name: 'عرض تفاصيل المستخدم',
    })
    expect(
      within(detailsDialog).getByText('Abdulaziz Ahmed Salem Alhashmi'),
    ).toBeInTheDocument()
    expect(
      within(detailsDialog).getByText('الانشطة الأخيرة'),
    ).toBeInTheDocument()
    expect(
      within(detailsDialog).getByText('إنشاء حساب جديد للمستخدم'),
    ).toBeInTheDocument()
  })

  it('does not open details modal when clicking table edit action', () => {
    const { router } = renderUsersRoute()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'تعديل المستخدم عبد العزيز أحمد سالم الهاشمي',
      }),
    )

    expect(router.state.location.pathname).toBe(ROUTE_PATHS.usersAdd)
    expect(
      screen.queryByRole('dialog', { name: 'عرض تفاصيل المستخدم' }),
    ).not.toBeInTheDocument()
  })

  it('navigates to the add page in edit mode with prefilled data from row action', () => {
    const { router } = renderUsersRoute()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'تعديل المستخدم عبد العزيز أحمد سالم الهاشمي',
      }),
    )

    expect(router.state.location.pathname).toBe(ROUTE_PATHS.usersAdd)
    expect(
      screen.getByRole('heading', { name: 'تعديل مستخدم' }),
    ).toBeInTheDocument()
    expect(
      screen.getByDisplayValue('عبد العزيز أحمد سالم الهاشمي'),
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue('phoenix@AqarInn')).toBeInTheDocument()
    expect(document.getElementById('user-role')).toHaveTextContent(
      'Super Admin المشرف العام',
    )
  })

  it('navigates to edit mode when modal edit is clicked', async () => {
    const { router } = renderUsersRoute()

    fireEvent.click(screen.getByText('عبد العزيز أحمد سالم الهاشمي'))
    const detailsDialog = await screen.findByRole('dialog', {
      name: 'عرض تفاصيل المستخدم',
    })

    fireEvent.click(
      within(detailsDialog).getByRole('button', { name: 'تعديل' }),
    )

    expect(router.state.location.pathname).toBe(ROUTE_PATHS.usersAdd)
    expect(
      screen.getByRole('heading', { name: 'تعديل مستخدم' }),
    ).toBeInTheDocument()
  })

  it('opens delete confirmation from modal delete action and closes details modal', async () => {
    renderUsersRoute()

    fireEvent.click(screen.getByText('ريم عبد الرحمن سعود البلوي'))
    const detailsDialog = await screen.findByRole('dialog', {
      name: 'عرض تفاصيل المستخدم',
    })

    fireEvent.click(within(detailsDialog).getByRole('button', { name: 'حذف' }))

    expect(
      screen.queryByRole('dialog', { name: 'عرض تفاصيل المستخدم' }),
    ).not.toBeInTheDocument()
    expect(
      await screen.findByRole('dialog', { name: 'حذف المستخدم' }),
    ).toBeInTheDocument()
  })

  it('closes details modal by close button and Escape and changes activity content per user', async () => {
    renderUsersRoute()

    fireEvent.click(screen.getByText('عبد العزيز أحمد سالم الهاشمي'))
    const firstDialog = await screen.findByRole('dialog', {
      name: 'عرض تفاصيل المستخدم',
    })
    expect(
      within(firstDialog).getByText('إنشاء حساب جديد للمستخدم'),
    ).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(
      screen.queryByRole('dialog', { name: 'عرض تفاصيل المستخدم' }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('ليلى حسن علي الغامدي'))
    const secondDialog = await screen.findByRole('dialog', {
      name: 'عرض تفاصيل المستخدم',
    })
    expect(
      within(secondDialog).getByText('تحديث صلاحيات مستخدم'),
    ).toBeInTheDocument()

    fireEvent.click(
      within(secondDialog).getByRole('button', { name: 'إغلاق النافذة' }),
    )
    expect(
      screen.queryByRole('dialog', { name: 'عرض تفاصيل المستخدم' }),
    ).not.toBeInTheDocument()
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
    fireEvent.click(screen.getByLabelText(/الدور/))
    fireEvent.click(screen.getByRole('option', { name: /Operation Admin/ }))
    fireEvent.click(screen.getByLabelText(/الحالة/))
    fireEvent.click(screen.getByLabelText(/قائمة الفرص الاستثمارية/))
    fireEvent.click(
      screen.getByRole('option', { name: /مجمع سكني حديث في شمال الرياض/ }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'اضافة المستخدم' }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(router.state.location.pathname).toBe(ROUTE_PATHS.users)
    expect(
      await screen.findByText('تم اضافة المستخدم بنجاح'),
    ).toBeInTheDocument()
  })

  it('opens the delete modal, cancels it, then confirms soft delete locally', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    renderUsersRoute()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'حذف المستخدم ريم عبد الرحمن سعود البلوي',
      }),
    )

    const cancelDialog = await screen.findByRole('dialog', {
      name: 'حذف المستخدم',
    })
    fireEvent.click(within(cancelDialog).getByRole('button', { name: 'الغاء' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'حذف المستخدم ريم عبد الرحمن سعود البلوي',
      }),
    )
    const confirmDialog = await screen.findByRole('dialog', {
      name: 'حذف المستخدم',
    })
    fireEvent.click(within(confirmDialog).getByRole('button', { name: 'حذف' }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(
      screen.queryByText('ريم عبد الرحمن سعود البلوي'),
    ).not.toBeInTheDocument()
    expect(await screen.findByText('تم حذف المستخدم بنجاح')).toBeInTheDocument()
  })
})
