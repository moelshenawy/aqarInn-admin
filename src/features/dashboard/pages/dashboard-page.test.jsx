import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import DashboardPage from '@/features/dashboard/pages/dashboard-page'
import { dashboardRouteMeta } from '@/features/dashboard/routes/dashboard.route'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'

function renderDashboardRoute() {
  window.localStorage.setItem('aqarinn.backoffice.language', 'ar')

  const router = createMemoryRouter(
    [
      {
        path: '/app',
        element: <DashboardLayout />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />,
            handle: dashboardRouteMeta,
          },
        ],
      },
    ],
    {
      initialEntries: ['/app/dashboard'],
    },
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

describe('DashboardPage route', () => {
  it('renders the figma-based dashboard shell and content in Arabic', async () => {
    renderDashboardRoute()

    expect(await screen.findAllByText('لوحة المعلومات')).not.toHaveLength(0)
    expect(screen.getByText('الفرص الاستثمارية')).toBeInTheDocument()
    expect(screen.getByText('ادارة المستخدمين')).toBeInTheDocument()
    expect(screen.queryByText('توزيعات الأرباح')).not.toBeInTheDocument()
    expect(screen.queryByText('سجل النشاطات')).not.toBeInTheDocument()

    expect(screen.getByText('ملخص مؤشرات الأداء الرئيسية')).toBeInTheDocument()
    expect(screen.getByText('إجمالي فرص الاستثمار')).toBeInTheDocument()
    expect(
      screen.getByText('أفضل فرص الاستثمار حسب المبلغ الممول'),
    ).toBeInTheDocument()
    expect(screen.getByText('نظرة عامة على المعاملات')).toBeInTheDocument()
    expect(screen.getByText('إجمالي المبلغ المستثمر')).toBeInTheDocument()
    expect(screen.getByText('106,444,039')).toBeInTheDocument()
    expect(screen.queryByText('English')).not.toBeInTheDocument()
  })
})
