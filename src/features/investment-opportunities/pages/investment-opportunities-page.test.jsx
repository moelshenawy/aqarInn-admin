import { act } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import InvestmentOpportunitiesPage from '@/features/investment-opportunities/pages/investment-opportunities-page'
import { investmentOpportunitiesRouteMeta } from '@/features/investment-opportunities/routes/investment-opportunities.route'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'

function renderInvestmentOpportunitiesRoute() {
  window.localStorage.setItem('aqarinn.backoffice.language', 'ar')

  const router = createMemoryRouter(
    [
      {
        path: '/app',
        element: <DashboardLayout />,
        children: [
          {
            path: 'investment-opportunities',
            element: <InvestmentOpportunitiesPage />,
            handle: investmentOpportunitiesRouteMeta,
          },
        ],
      },
    ],
    {
      initialEntries: ['/app/investment-opportunities'],
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

describe('InvestmentOpportunitiesPage route', () => {
  it('renders the investment opportunities screen with loading, filtering, and pagination', async () => {
    vi.useFakeTimers()
    renderInvestmentOpportunitiesRoute()

    expect(screen.getByTestId('investment-skeleton')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(500)
      await Promise.resolve()
    })

    expect(screen.getAllByText('الفرص الاستثمارية')).not.toHaveLength(0)
    expect(
      screen.getByRole('button', { name: 'إضافة فرصة استثمارية' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /الرياض/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'التالي' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'السابق' })).toBeDisabled()
    expect(
      screen.getByRole('button', { current: 'page', name: '1' }),
    ).toBeInTheDocument()
    expect(screen.getByText('RES-RYD-001')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
    expect(screen.getByTestId('investment-skeleton')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(500)
      await Promise.resolve()
    })

    expect(
      screen.getByRole('button', { current: 'page', name: '2' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('RES-RYD-001')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /جدة/ }))
    expect(screen.getByTestId('investment-skeleton')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(500)
      await Promise.resolve()
    })

    expect(
      screen.getByRole('button', { current: 'page', name: '1' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'السابق' })).toBeDisabled()
    expect(screen.queryByText('RES-RYD-001')).not.toBeInTheDocument()
    expect(screen.getByText('RES-JED-023')).toBeInTheDocument()

    const cardRegion = screen.getByLabelText('بطاقات الفرص الاستثمارية')
    expect(within(cardRegion).getAllByText('منشورة')).not.toHaveLength(0)

    vi.useRealTimers()
  })
})
