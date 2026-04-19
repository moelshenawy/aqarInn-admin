import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import { dashboardRouteMeta } from '@/features/dashboard/routes/dashboard.route'
import { investmentOpportunitiesRouteMeta } from '@/features/investment-opportunities/routes/investment-opportunities.route'
import { usersRouteMeta } from '@/features/users/routes/users.route'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

function renderWithRole({ role, roles, initialEntries }) {
  window.localStorage.setItem('aqarinn.backoffice.language', 'ar')
  window.localStorage.setItem('authToken', 'test-auth-token')
  window.localStorage.setItem(
    'authUser',
    JSON.stringify({
      id: 'admin-1',
      email: 'admin@aqarinn.test',
      full_name_ar: 'مدير النظام',
      full_name_en: 'System Admin',
      role,
      roles,
    }),
  )

  const router = createMemoryRouter(
    [
      {
        path: '/app',
        element: <DashboardLayout />,
        children: [
          {
            path: 'dashboard',
            element: <div>Dashboard page</div>,
            handle: dashboardRouteMeta,
          },
          {
            path: 'investment-opportunities',
            element: <div>Investment opportunities page</div>,
            handle: investmentOpportunitiesRouteMeta,
          },
          {
            path: 'users',
            element: <div>Users page</div>,
            handle: usersRouteMeta,
          },
        ],
      },
      {
        path: ROUTE_PATHS.unauthorized,
        element: <div>Unauthorized page</div>,
      },
      {
        path: `/en${ROUTE_PATHS.unauthorized}`,
        element: <div>Unauthorized page</div>,
      },
    ],
    { initialEntries },
  )

  return render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={createTestQueryClient()}>
        <AuthProvider>
          <AppDirectionProvider>
            <RouterProvider router={router} />
          </AppDirectionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nextProvider>,
  )
}

describe('DashboardLayout authorization', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('redirects non-super-admin user from dashboard to unauthorized', async () => {
    renderWithRole({
      role: 'operationsAdmin',
      roles: ['operationsAdmin'],
      initialEntries: [ROUTE_PATHS.dashboard],
    })

    expect(await screen.findByText('Unauthorized page')).toBeInTheDocument()
  })

  it('hides dashboard and users modules in sidebar for investment manager', async () => {
    renderWithRole({
      role: 'investmentManager',
      roles: ['investmentManager'],
      initialEntries: [ROUTE_PATHS.investmentOpportunities],
    })

    expect(
      await screen.findByText('Investment opportunities page'),
    ).toBeInTheDocument()

    expect(
      document.querySelector(
        `a[data-slot="dashboard-sidebar-item"][href="${ROUTE_PATHS.investmentOpportunities}"]`,
      ),
    ).not.toBeNull()
    expect(
      document.querySelector(
        `a[data-slot="dashboard-sidebar-item"][href="${ROUTE_PATHS.dashboard}"]`,
      ),
    ).toBeNull()
    expect(
      document.querySelector(
        `a[data-slot="dashboard-sidebar-item"][href="${ROUTE_PATHS.users}"]`,
      ),
    ).toBeNull()
  })
})
