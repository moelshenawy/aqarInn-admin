import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import DashboardPage from '@/features/dashboard/pages/dashboard-page'
import { dashboardRouteMeta } from '@/features/dashboard/routes/dashboard.route'
import {
  getDashboardOverview,
  getDashboardTransactionsOverview,
} from '@/features/dashboard/services/dashboard-service'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/language'

vi.mock('@/features/dashboard/services/dashboard-service', () => ({
  getDashboardOverview: vi.fn(),
  getDashboardTransactionsOverview: vi.fn(),
}))

const dashboardOverviewFixture = {
  total_users: 1,
  verified_users: 0,
  total_invested_amount: 10500,
  total_returns_distributed: 48787,
  total_withdrawals_paid: 0,
  total_withdrawals_requested: 0,
  opportunities_count: 3,
  opportunities_by_status: {
    funded: 1,
    published: 2,
  },
  summary_cards: [
    {
      key: 'total_users',
      label: 'Total users',
      value: 1,
      value_type: 'count',
    },
    {
      key: 'verified_users',
      label: 'Verified users',
      value: 0,
      value_type: 'count',
    },
    {
      key: 'total_invested_amount',
      label: 'Total invested amount',
      value: 10500,
      value_type: 'currency',
    },
  ],
  opportunities_status_overview: {
    title: 'Total investment opportunities',
    total: 3,
    statuses: [
      {
        key: 'draft',
        label: 'Draft',
        count: 0,
        share_pct: 0,
        bar_pct: 0,
      },
      {
        key: 'published',
        label: 'Published',
        count: 2,
        share_pct: 66.67,
        bar_pct: 100,
      },
      {
        key: 'funded',
        label: 'Funded',
        count: 1,
        share_pct: 33.33,
        bar_pct: 50,
      },
    ],
  },
  featured_opportunities: {
    title: 'Top investment opportunities by funded amount',
    items: [
      {
        id: '1',
        reference_code: 'IO-KHO-003',
        title: 'مجمع العقربية للأعمال',
        status: 'funded',
        status_label: 'Funded',
        city: 'الخبر',
        neighborhood: 'Al Aqrabiyah',
        cover_image_url: 'https://placehold.co/358x131',
        funded_amount: 8100000,
        currency: 'SAR',
        funded_shares: 2700,
        total_shares: 2700,
        investors_count: 143,
        funding_progress_pct: 100,
      },
    ],
  },
  transactions_overview: {
    title: 'Transactions overview',
    selected_filter: 'today',
    filters: [
      { key: 'today', label: 'Today', is_selected: true },
      { key: 'last_7_days', label: 'Last 7 days', is_selected: false },
      { key: 'last_month', label: 'Last month', is_selected: false },
      { key: 'all_time', label: 'All time', is_selected: false },
    ],
    cards: [
      {
        key: 'distributions',
        label: 'Distributions',
        count: 3,
        amount: 33787,
        currency: 'SAR',
      },
      {
        key: 'withdrawal_requests',
        label: 'Withdrawal requests',
        count: 0,
        amount: 0,
        currency: 'SAR',
      },
      {
        key: 'investments',
        label: 'Investments',
        count: 0,
        amount: 0,
        currency: 'SAR',
      },
    ],
  },
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
}

async function renderDashboardRoute({
  initialEntries = ['/app/dashboard'],
  language = 'en',
} = {}) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)

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

  await act(async () => {
    await i18n.changeLanguage(language)
  })

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
      initialEntries,
    },
  )

  return render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={createTestQueryClient()}>
        <AuthProvider>
          <AppDirectionProvider>
            <TooltipProvider delayDuration={0}>
              <RouterProvider router={router} />
            </TooltipProvider>
          </AppDirectionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nextProvider>,
  )
}

describe('DashboardPage dynamic API rendering', () => {
  beforeEach(() => {
    vi.mocked(getDashboardOverview).mockResolvedValue(dashboardOverviewFixture)
    vi.mocked(getDashboardTransactionsOverview).mockImplementation((filter) => {
      if (filter === 'last_7_days') {
        return Promise.resolve({
          ...dashboardOverviewFixture.transactions_overview,
          selected_filter: 'last_7_days',
          filters: dashboardOverviewFixture.transactions_overview.filters.map(
            (item) => ({
              ...item,
              is_selected: item.key === 'last_7_days',
            }),
          ),
          cards: [
            {
              key: 'distributions',
              label: 'Distributions',
              count: 5,
              amount: 44000,
              currency: 'SAR',
            },
            {
              key: 'withdrawal_requests',
              label: 'Withdrawal requests',
              count: 7,
              amount: 120000,
              currency: 'SAR',
            },
            {
              key: 'investments',
              label: 'Investments',
              count: 2,
              amount: 99000,
              currency: 'SAR',
            },
          ],
        })
      }

      return Promise.resolve(dashboardOverviewFixture.transactions_overview)
    })
  })

  afterEach(async () => {
    vi.clearAllMocks()
    window.localStorage.clear()
    await act(async () => {
      await i18n.changeLanguage('en')
    })
  })

  it('renders summary cards from summary_cards API', async () => {
    await renderDashboardRoute()

    expect(await screen.findByText('Total users')).toBeInTheDocument()
    expect(screen.getByText('Verified users')).toBeInTheDocument()
    expect(screen.getByText('Total invested amount')).toBeInTheDocument()
    expect(screen.getByText('10,500')).toBeInTheDocument()
  })

  it('renders opportunities status table from opportunities_status_overview', async () => {
    await renderDashboardRoute()

    expect(
      await screen.findByText('Total investment opportunities'),
    ).toBeInTheDocument()
    expect(screen.getByText('Published')).toBeInTheDocument()
    expect(screen.getAllByText('Funded')).not.toHaveLength(0)
  })

  it('renders featured opportunities from featured_opportunities.items', async () => {
    await renderDashboardRoute()

    expect(
      await screen.findByText('Top investment opportunities by funded amount'),
    ).toBeInTheDocument()
    expect(screen.getByText('مجمع العقربية للأعمال')).toBeInTheDocument()
    expect(screen.getByText('IO-KHO-003')).toBeInTheDocument()
  })

  it('renders transactions cards from transactions_overview.cards', async () => {
    await renderDashboardRoute()

    const section = await screen.findByRole('region', {
      name: 'Transactions overview',
    })

    expect(within(section).getByRole('button', { name: 'Today' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Distributions' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Withdrawal requests' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Investments' })).toBeInTheDocument()
  })

  it('clicking transaction filter refetches only transactions overview cards', async () => {
    await renderDashboardRoute()

    const newSection = document.querySelector(
      '[data-slot="dashboard-transactions-summary-v2-section"]',
    )
    const last7DaysButton = await within(newSection).findByRole('button', {
      name: 'Last 7 days',
    })

    fireEvent.click(last7DaysButton)

    await waitFor(() => {
      expect(getDashboardTransactionsOverview).toHaveBeenCalledWith(
        'last_7_days',
      )
    })

    expect(await screen.findByRole('region', { name: 'Distributions' })).toBeInTheDocument()
    expect(screen.getAllByText('44,000')).not.toHaveLength(0)
  })

  it('renders the new pixel-perfect transactions summary section with ordered cards and Figma badge rule', async () => {
    await renderDashboardRoute()

    const newSection = document.querySelector(
      '[data-slot="dashboard-transactions-summary-v2-section"]',
    )
    expect(newSection).not.toBeNull()

    await waitFor(() => {
      expect(
        newSection.querySelectorAll(
          '[data-slot="dashboard-transactions-summary-v2-card"]',
        ).length,
      ).toBeGreaterThan(0)
    })

    const cardsContainer = newSection.querySelector(
      '[data-slot="dashboard-transactions-summary-v2-cards"]',
    )
    expect(cardsContainer).not.toBeNull()

    const cardKeys = Array.from(
      cardsContainer.querySelectorAll(
        '[data-slot="dashboard-transactions-summary-v2-card"]',
      ),
    ).map((node) => node.getAttribute('data-card-key'))

    expect(cardKeys).toEqual([
      'investments',
      'withdrawal_requests',
      'distributions',
    ])

    expect(
      newSection.querySelectorAll(
        '[data-slot="dashboard-transactions-summary-v2-card-badge"]',
      ),
    ).toHaveLength(2)

    const distributionsCard = newSection.querySelector(
      '[data-card-key="distributions"]',
    )
    expect(
      distributionsCard.querySelector(
        '[data-slot="dashboard-transactions-summary-v2-card-badge"]',
      ),
    ).toBeNull()
  })

  it('updates active filter and card amounts in new section', async () => {
    await renderDashboardRoute()

    const newSection = document.querySelector(
      '[data-slot="dashboard-transactions-summary-v2-section"]',
    )

    const newFilterButton = await within(newSection).findByRole('button', {
      name: 'Last 7 days',
    })

    fireEvent.click(newFilterButton)

    await waitFor(() => {
      expect(getDashboardTransactionsOverview).toHaveBeenCalledWith(
        'last_7_days',
      )
    })
    expect(newFilterButton).toHaveAttribute('data-state', 'active')
    expect(screen.getAllByText('44,000')).not.toHaveLength(0)
  })

  it('falls back safely when dashboard API fails', async () => {
    vi.mocked(getDashboardOverview).mockRejectedValueOnce(new Error('network-failed'))

    await renderDashboardRoute()

    await waitFor(() => {
      expect(
        document.querySelectorAll('[data-slot="dashboard-metric-card-skeleton"]'),
      ).toHaveLength(0)
    })
  })
})
