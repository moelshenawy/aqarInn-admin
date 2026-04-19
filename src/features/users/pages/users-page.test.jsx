import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
import * as usersService from '@/features/users/services/users-service'

vi.mock('@/features/users/services/users-service', () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}))

const adminUsersResponse = {
  message: 'OK',
  data: [
    {
      id: 'a18cc8cc-073a-4532-9ef4-cd09b0e33e6a',
      code: 'ADM-001',
      full_name: 'System Admin',
      full_name_ar: 'مدير النظام',
      full_name_en: 'System Admin',
      email: 'admin@aqarinn.test',
      mobile_number: '0500000001',
      status: 'active',
      is_system_protected: true,
      last_login_at: '2026-04-19T08:26:59.000000Z',
      created_at: '2026-04-15T13:39:23.000000Z',
      updated_at: '2026-04-19T08:26:59.000000Z',
      role: 'investmentManager',
      role_label: 'Investment manager',
      roles: [
        'investmentManager',
        'operationsAdmin',
        'readOnlyViewer',
        'superAdmin',
      ],
    },
    {
      id: 'b28cc8cc-073a-4532-9ef4-cd09b0e33e6b',
      code: 'ADM-002',
      full_name: 'Operations User',
      full_name_ar: 'مدير العمليات',
      full_name_en: 'Operations User',
      email: 'ops@aqarinn.test',
      mobile_number: '0500000002',
      status: 'inactive',
      is_system_protected: false,
      last_login_at: null,
      created_at: '2026-04-16T10:00:00.000000Z',
      updated_at: '2026-04-16T10:00:00.000000Z',
      role: 'operationsAdmin',
      role_label: 'Operations admin',
      roles: ['operationsAdmin'],
    },
  ],
}

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
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  const renderResult = render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppDirectionProvider>
            <RouterProvider router={router} />
            <Toaster richColors closeButton />
          </AppDirectionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nextProvider>,
  )

  return { router, ...renderResult }
}

describe('UsersPage route', () => {
  beforeEach(() => {
    usersService.getUsers.mockResolvedValue(adminUsersResponse)
    usersService.createUser.mockResolvedValue({ message: 'Created' })
    usersService.updateUser.mockResolvedValue({ message: 'Updated' })
    usersService.deleteUser.mockResolvedValue({ message: 'Deleted' })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders admin users and shows role from the API response', async () => {
    renderUsersRoute()

    expect(
      await screen.findByRole('heading', { name: 'جميع المستخدمين' }),
    ).toBeInTheDocument()
    expect(await screen.findByText('ADM-001')).toBeInTheDocument()
    expect(screen.getByText('Investment manager')).toBeInTheDocument()
    expect(screen.queryByText('بدون مدينة')).not.toBeInTheDocument()
    expect(usersService.getUsers).toHaveBeenCalledTimes(1)
  })

  it('opens details from the list payload without a separate detail request', async () => {
    renderUsersRoute()

    fireEvent.click(await screen.findByText('ADM-001'))

    expect(await screen.findByRole('button', { name: 'تعديل' })).toBeInTheDocument()
    expect(screen.getByText('System Admin')).toBeInTheDocument()
    expect(screen.getAllByText('Investment manager').length).toBeGreaterThan(0)
    expect(screen.getAllByText('ADM-001').length).toBeGreaterThan(0)
    expect(usersService.getUsers).toHaveBeenCalledTimes(1)
  })

  it('navigates to edit mode with the backend role key preserved', async () => {
    const { router } = renderUsersRoute()

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'تعديل المستخدم مدير النظام',
      }),
    )

    expect(router.state.location.pathname).toBe(ROUTE_PATHS.usersAdd)
    expect(
      await screen.findByRole('heading', { name: 'تعديل مستخدم' }),
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue('ADM-001')).toBeInTheDocument()
    expect(document.getElementById('user-role')).toHaveTextContent(
      'Investment Manager مدير الاستثمار',
    )
  })

  it('submits create with the admin-users payload including role and password', async () => {
    const { router } = renderUsersRoute({
      initialEntries: [ROUTE_PATHS.usersAdd],
    })

    fireEvent.change(screen.getByLabelText(/الكود/), {
      target: { value: 'ADM-003' },
    })
    fireEvent.click(screen.getByLabelText(/الدور الوظيفي/))
    fireEvent.click(
      screen.getByRole('option', { name: /Investment Manager مدير الاستثمار/ }),
    )
    fireEvent.change(screen.getByLabelText(/الاسم الكامل بالإنجليزية/), {
      target: { value: 'Sara Ahmed Alhashmi' },
    })
    fireEvent.change(screen.getByLabelText(/الاسم الكامل بالعربية/), {
      target: { value: 'سارة أحمد الهاشمي' },
    })
    fireEvent.change(screen.getByLabelText(/رقم الجوال/), {
      target: { value: '0501234567' },
    })
    fireEvent.change(screen.getByLabelText(/البريد الإلكتروني/), {
      target: { value: 'sara@aqarinn.test' },
    })
    fireEvent.change(screen.getByLabelText(/كلمة المرور/), {
      target: { value: 'Pass@1234' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'إضافة المستخدم' }))

    await waitFor(() =>
      expect(usersService.createUser).toHaveBeenCalled(),
    )
    expect(usersService.createUser.mock.calls[0][0]).toEqual({
      code: 'ADM-003',
      full_name_ar: 'سارة أحمد الهاشمي',
      full_name_en: 'Sara Ahmed Alhashmi',
      email: 'sara@aqarinn.test',
      mobile_number: '0501234567',
      password: 'Pass@1234',
      status: 'active',
      role: 'investmentManager',
    })
    expect(router.state.location.pathname).toBe(ROUTE_PATHS.users)
  })

  it('submits delete for non-protected users and blocks protected users', async () => {
    renderUsersRoute()

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'حذف المستخدم مدير العمليات',
      }),
    )

    const confirmDialog = await screen.findByRole('dialog', {
      name: 'حذف المستخدم',
    })
    fireEvent.click(within(confirmDialog).getByRole('button', { name: 'حذف' }))

    await waitFor(() =>
      expect(usersService.deleteUser).toHaveBeenCalled(),
    )
    expect(usersService.deleteUser.mock.calls[0][0]).toBe(
      'b28cc8cc-073a-4532-9ef4-cd09b0e33e6b',
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'حذف المستخدم مدير النظام',
      }),
    )

    const protectedDialog = await screen.findByRole('dialog', {
      name: 'حذف المستخدم',
    })
    fireEvent.click(
      within(protectedDialog).getByRole('button', { name: 'حذف' }),
    )

    await waitFor(() =>
      expect(usersService.deleteUser).toHaveBeenCalledTimes(1),
    )
  })
})
