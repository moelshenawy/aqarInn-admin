import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import * as opportunityService from '@/features/investment-opportunities/services/investment-opportunity-service'
import UsersAddPage from '@/features/users/pages/users-add-page'
import UsersPage from '@/features/users/pages/users-page'
import * as usersService from '@/features/users/services/users-service'
import {
  usersAddRouteMeta,
  usersRouteMeta,
} from '@/features/users/routes/users.route'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'

vi.mock('@/features/users/services/users-service', () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}))

vi.mock('@/features/investment-opportunities/services/investment-opportunity-service', () => ({
  getOpportunities: vi.fn(),
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
      roles: ['investmentManager', 'operationsAdmin'],
      investment_opportunity_ids: ['io-1'],
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
      role: 'superAdmin',
      roles: ['superAdmin'],
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

function fillCreateUserBaseFields() {
  fireEvent.change(document.getElementById('user-full-name-en'), {
    target: { value: 'Sara Ahmed Alhashmi' },
  })
  fireEvent.change(document.getElementById('user-full-name-ar'), {
    target: { value: 'سارة أحمد الهاشمي' },
  })
  fireEvent.change(document.getElementById('user-mobile'), {
    target: { value: '0501234567' },
  })
  fireEvent.change(document.getElementById('user-email'), {
    target: { value: 'sara@aqarinn.test' },
  })
  fireEvent.change(document.getElementById('user-password'), {
    target: { value: 'Pass@1234' },
  })
}

describe('UsersPage route', () => {
  beforeEach(() => {
    usersService.getUsers.mockResolvedValue(adminUsersResponse)
    usersService.createUser.mockResolvedValue({ message: 'Created' })
    usersService.updateUser.mockResolvedValue({ message: 'Updated' })
    usersService.deleteUser.mockResolvedValue({ message: 'Deleted' })
    opportunityService.getOpportunities.mockResolvedValue({
      current_page: 1,
      last_page: 1,
      total: 1,
      per_page: 20,
      data: [
        {
          id: 'io-1',
          reference_code: 'RES-RUH-001',
          title_ar: 'فرصة الرياض',
          title_en: 'Riyadh Opportunity',
          status: 'published',
          city_id: '1',
          total_shares: 1000,
          funded_shares: 100,
          property_price: '1000000',
        },
      ],
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders admin users and shows role from API', async () => {
    renderUsersRoute()

    expect(await screen.findByText('ADM-001')).toBeInTheDocument()
    expect(screen.getByText('Investment manager')).toBeInTheDocument()
    expect(usersService.getUsers).toHaveBeenCalledTimes(1)
  })

  it('opens details from list payload and navigates to edit with single-role prefill', async () => {
    const { router } = renderUsersRoute()

    fireEvent.click(await screen.findByText('ADM-001'))

    expect(await screen.findByRole('button', { name: 'تعديل' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'تعديل' }))

    expect(router.state.location.pathname).toBe(ROUTE_PATHS.usersAdd)
    expect(document.getElementById('user-role')).toHaveTextContent('Investment Manager')
  })

  it('submits create payload with role and roles for investment manager', async () => {
    const { router } = renderUsersRoute({
      initialEntries: [ROUTE_PATHS.usersAdd],
    })

    fireEvent.click(document.getElementById('user-role'))
    fireEvent.click(screen.getByRole('option', { name: /Investment Manager/i }))
    fireEvent.click(await screen.findByText(/RES-RUH-001/i))

    fillCreateUserBaseFields()

    fireEvent.click(document.querySelector('button[type="submit"]'))

    await waitFor(() => {
      expect(usersService.createUser).toHaveBeenCalledTimes(1)
    })

    expect(usersService.createUser.mock.calls[0][0]).toEqual({
      full_name_ar: 'سارة أحمد الهاشمي',
      full_name_en: 'Sara Ahmed Alhashmi',
      email: 'sara@aqarinn.test',
      mobile_number: '0501234567',
      password: 'Pass@1234',
      status: 'active',
      role: 'investmentManager',
      roles: ['investmentManager'],
    })
    expect(router.state.location.pathname).toBe(ROUTE_PATHS.users)
  })

  it('blocks create when investment manager is selected without IO checklist selection', async () => {
    renderUsersRoute({
      initialEntries: [ROUTE_PATHS.usersAdd],
    })

    fireEvent.click(document.getElementById('user-role'))
    fireEvent.click(screen.getByRole('option', { name: /Investment Manager/i }))

    fillCreateUserBaseFields()

    fireEvent.click(document.querySelector('button[type="submit"]'))

    await waitFor(() => {
      expect(usersService.createUser).not.toHaveBeenCalled()
    })
  })

  it('deletes non-protected user and blocks protected user deletion', async () => {
    renderUsersRoute()

    const operationsRow = (await screen.findByText('ADM-002')).closest('tr')
    fireEvent.click(within(operationsRow).getAllByRole('button')[0])

    const confirmDialog = await screen.findByRole('dialog')
    fireEvent.click(within(confirmDialog).getAllByRole('button').at(-1))

    await waitFor(() => {
      expect(usersService.deleteUser).toHaveBeenCalledTimes(1)
    })
    expect(usersService.deleteUser.mock.calls[0][0]).toBe(
      'b28cc8cc-073a-4532-9ef4-cd09b0e33e6b',
    )

    const protectedRow = (await screen.findByText('ADM-001')).closest('tr')
    fireEvent.click(within(protectedRow).getAllByRole('button')[0])

    const protectedDialog = await screen.findByRole('dialog')
    fireEvent.click(within(protectedDialog).getAllByRole('button').at(-1))

    await waitFor(() => {
      expect(usersService.deleteUser).toHaveBeenCalledTimes(1)
    })
  })
})
