import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { Toaster } from '@/components/ui/sonner'
import {
  buildInvestmentOpportunityDetailsPath,
  buildInvestmentOpportunityEditPath,
  buildInvestmentOpportunityProfitDistributionsPath,
  ROUTE_PATHS,
} from '@/app/router/route-paths'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import InvestmentOpportunityAddPage from '@/features/investment-opportunities/pages/investment-opportunity-add-page'
import InvestmentOpportunityDetailsPage from '@/features/investment-opportunities/pages/investment-opportunity-details-page'
import InvestmentOpportunityEditPage from '@/features/investment-opportunities/pages/investment-opportunity-edit-page'
import InvestmentOpportunityProfitDistributionsPage from '@/features/investment-opportunities/pages/investment-opportunity-profit-distributions-page'
import InvestmentOpportunitiesPage from '@/features/investment-opportunities/pages/investment-opportunities-page'
import {
  createOpportunity,
  createOpportunityDraft,
  createOpportunityProfitDistribution,
  deleteOpportunity,
  getCities,
  getProfitDistributionById,
  getOpportunityById,
  getOpportunityProfitDistributions,
  getOpportunities,
  updateOpportunity,
} from '@/features/investment-opportunities/services/investment-opportunity-service'
import {
  investmentOpportunitiesRouteMeta,
  investmentOpportunityAddRouteMeta,
  investmentOpportunityDetailsRouteMeta,
  investmentOpportunityEditRouteMeta,
  investmentOpportunityProfitDistributionsRouteMeta,
} from '@/features/investment-opportunities/routes/investment-opportunities.route'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'

vi.mock(
  '@/features/investment-opportunities/services/investment-opportunity-service',
  () => ({
    getCities: vi.fn(),
    getProfitDistributionById: vi.fn(),
    getOpportunityById: vi.fn(),
    getOpportunityProfitDistributions: vi.fn(),
    getOpportunities: vi.fn(),
    createOpportunity: vi.fn(),
    createOpportunityDraft: vi.fn(),
    createOpportunityProfitDistribution: vi.fn(),
    updateOpportunity: vi.fn(),
    deleteOpportunity: vi.fn(),
  }),
)

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

function renderInvestmentOpportunitiesRoute({
  initialEntries = [ROUTE_PATHS.investmentOpportunities],
} = {}) {
  window.localStorage.setItem('aqarinn.backoffice.language', 'ar')
  window.localStorage.setItem('authToken', 'test-auth-token')
  window.localStorage.setItem(
    'authUser',
    JSON.stringify({
      id: 'admin-1',
      email: 'admin@aqarinn.test',
      full_name_ar: 'مدير النظام',
      full_name_en: 'System Admin',
      is_super_admin: true,
    }),
  )

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
          {
            path: 'investment-opportunities/add',
            element: <InvestmentOpportunityAddPage />,
            handle: investmentOpportunityAddRouteMeta,
          },
          {
            path: 'investment-opportunities/:opportunityId',
            element: <InvestmentOpportunityDetailsPage />,
            handle: investmentOpportunityDetailsRouteMeta,
          },
          {
            path: 'investment-opportunities/:opportunityId/edit',
            element: <InvestmentOpportunityEditPage />,
            handle: investmentOpportunityEditRouteMeta,
          },
          {
            path: 'investment-opportunities/:opportunityId/profit-distributions',
            element: <InvestmentOpportunityProfitDistributionsPage />,
            handle: investmentOpportunityProfitDistributionsRouteMeta,
          },
        ],
      },
    ],
    { initialEntries },
  )

  const renderResult = render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={createTestQueryClient()}>
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

async function fillPublishRequiredFields() {
  await waitFor(() => {
    expect(document.getElementById('cityId')).not.toBeNull()
  })
  fireEvent.change(document.getElementById('titleAr'), {
    target: { value: 'فرصة استثمارية - الرياض' },
  })
  fireEvent.change(document.getElementById('titleEn'), {
    target: { value: 'Investment Opportunity - Riyadh' },
  })
  fireEvent.change(document.getElementById('cityId'), {
    target: { value: 'a18cc8cc-0ebb-4888-800e-9d7c375674c6' },
  })
  fireEvent.change(document.getElementById('neighborhood'), {
    target: { value: 'Al Malqa' },
  })
  fireEvent.change(document.getElementById('propertyType'), {
    target: { value: 'residential' },
  })
  fireEvent.change(document.getElementById('propertyPrice'), {
    target: { value: '3500000' },
  })
  fireEvent.change(document.getElementById('currency'), {
    target: { value: 'SAR' },
  })
  fireEvent.change(document.getElementById('shareCount'), {
    target: { value: '1000' },
  })
  fireEvent.change(document.getElementById('sharePrice'), {
    target: { value: '3500' },
  })
  fireEvent.change(document.getElementById('minInvestmentShares'), {
    target: { value: '1' },
  })
  fireEvent.change(document.getElementById('maxSharesPerUser'), {
    target: { value: '100' },
  })
  fireEvent.change(document.getElementById('maxUserOwnershipPct'), {
    target: { value: '10' },
  })
  fireEvent.change(document.getElementById('expectedReturn'), {
    target: { value: '12.5' },
  })
  fireEvent.change(document.getElementById('returnFrequency'), {
    target: { value: 'quarterly' },
  })
  fireEvent.change(document.getElementById('investmentDurationMonths'), {
    target: { value: '24' },
  })
  fireEvent.change(document.getElementById('developerNameAr'), {
    target: { value: 'شركة الأفق' },
  })
  fireEvent.change(document.getElementById('developerNameEn'), {
    target: { value: 'Al Ofoq' },
  })
  fireEvent.change(document.getElementById('developerEmail'), {
    target: { value: 'info@alofoq.sa' },
  })
  fireEvent.change(document.getElementById('developerPhone'), {
    target: { value: '555555555' },
  })
  fireEvent.change(document.getElementById('investmentStartDate'), {
    target: { value: '2026-05-01' },
  })

  const cover = new File(['cover'], 'cover.png', { type: 'image/png' })
  const gallery = new File(['gallery'], 'gallery.png', { type: 'image/png' })
  fireEvent.change(document.getElementById('propertyImages'), {
    target: { files: [cover, gallery] },
  })
}

describe('InvestmentOpportunitiesPage route', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  const citiesFixture = [
    {
      id: 'a18cc8cc-0ebb-4888-800e-9d7c375674c6',
      name_ar: 'الرياض',
      name_en: 'Riyadh',
    },
    {
      id: 'a18cc8cc-0f11-46a1-90c7-768569804e9f',
      name_ar: 'جدة',
      name_en: 'Jeddah',
    },
  ]

  const opportunitiesPageOneFixture = {
    current_page: 1,
    last_page: 2,
    total: 21,
    per_page: 20,
    data: [
      {
        id: 'investment-riyadh-001',
        reference_code: 'RES-RYD-001',
        title: 'Riyadh Opportunity',
        status: 'published',
        city_id: 'a18cc8cc-0ebb-4888-800e-9d7c375674c6',
        total_shares: 1000,
        funded_shares: 300,
        property_price: '2500000.00',
        cover_image_url: 'https://placehold.co/358x131',
        city: citiesFixture[0],
      },
      {
        id: 'investment-khobar-005',
        reference_code: 'RES-KBR-005',
        title: 'Khobar Opportunity',
        status: 'published',
        city_id: 'a18cc8cc-0f50-4904-96e9-f8175f930a75',
        total_shares: 1500,
        funded_shares: 700,
        property_price: '3000000.00',
        cover_image_url: 'https://placehold.co/358x131',
        city: {
          id: 'a18cc8cc-0f50-4904-96e9-f8175f930a75',
          name_ar: 'الخبر',
          name_en: 'Al Khobar',
        },
      },
    ],
  }

  const opportunitiesPageTwoFixture = {
    current_page: 2,
    last_page: 2,
    total: 21,
    per_page: 20,
    data: [
      {
        id: 'investment-jeddah-023',
        reference_code: 'RES-JED-023',
        title: 'Jeddah Opportunity',
        status: 'published',
        city_id: 'a18cc8cc-0f11-46a1-90c7-768569804e9f',
        total_shares: 1200,
        funded_shares: 200,
        property_price: '2800000.00',
        cover_image_url: 'https://placehold.co/358x131',
        city: citiesFixture[1],
      },
    ],
  }

  const opportunityDetailsFixture = {
    id: 'investment-riyadh-001',
    reference_code: 'RES-RYD-001',
    title: 'Riyadh Opportunity',
    status: 'published',
    city_id: 'a18cc8cc-0ebb-4888-800e-9d7c375674c6',
    neighborhood: 'Al Olaya',
    location_text: 'Al Olaya, Riyadh',
    asset_type: 'commercial',
    area_m2: '3250.00',
    floors: 8,
    build_year: 2021,
    property_price: '4800000.00',
    total_shares: 1200,
    funded_shares: 372,
    share_price: '4000.00',
    expected_annual_return_pct: '9.40',
    schedule_investment_start: true,
    investment_start_at: '2026-04-29T13:39:23.000000Z',
    operator_name_ar: 'نجد كابيتال',
    operator_name_en: 'Najd Capital',
    operator_description: 'Specialized operator',
    operator_email: 'assets@najdcapital.test',
    operator_phone: '+966550000101',
    operator_location_text: 'Riyadh, Saudi Arabia',
    cover_image_url: 'https://placehold.co/358x131',
    gallery: [],
    city: citiesFixture[0],
  }

  const profitDistributionsFixture = [
    {
      id: 'a192b204-cce2-4324-9cf8-847ea1aef4c9',
      net_profit_amount: '125430.75',
      currency: 'SAR',
      distribution_date: '2026-04-15',
      status: 'distributed',
      distributed_by_admin: {
        code: 'AQIN001',
        full_name_ar: 'عبد العزيز أحمد سالم الهاشمي',
        full_name_en: 'Abdulaziz Ahmed Salem Al-Hashimi',
      },
      lines: Array.from({ length: 10 }, (_, index) => ({
        id: `line-${index + 1}`,
        shares_at_distribution: 120,
        amount: '1200.00',
        user: {
          full_name: `Investor ${index + 1}`,
          mobile_number: '966500123456',
        },
      })),
    },
  ]

  const createdProfitDistributionResponse = {
    message: 'Distribution created and posted.',
    data: {
      id: 'new-profit-distribution',
      net_profit_amount: '5540000.00',
      currency: 'SAR',
      distribution_date: '2026-04-15',
      distributed_by_admin: {
        code: 'AQIN001',
        full_name_ar: 'عبد العزيز أحمد سالم الهاشمي',
        full_name_en: 'Abdulaziz Ahmed Salem Al-Hashimi',
      },
      lines: [],
    },
  }

  const profitDistributionDetailsFixture = {
    id: 'a192b204-cce2-4324-9cf8-847ea1aef4c9',
    investment_opportunity_id: 'investment-riyadh-001',
    type: 'profit',
    net_profit_amount: '15000.00',
    currency: 'SAR',
    distribution_date: '2026-04-15',
    status: 'distributed',
    distributed_by_admin: {
      id: 'admin-1',
      code: 'ADM-001',
      full_name_ar: 'Mudeer Al Nizam',
      full_name_en: 'System Admin',
    },
    lines: [
      {
        id: 'line-1',
        shares_at_distribution: 3,
        amount: '15000.00',
        user: {
          id: 'user-1',
          full_name: 'Test User',
          mobile_number: '0500000000',
        },
      },
    ],
  }

  beforeEach(() => {
    vi.mocked(getCities).mockResolvedValue(citiesFixture)
    vi.mocked(getOpportunityById).mockResolvedValue(opportunityDetailsFixture)
    vi.mocked(getOpportunityProfitDistributions).mockResolvedValue(
      profitDistributionsFixture,
    )
    vi.mocked(getProfitDistributionById).mockResolvedValue(
      profitDistributionDetailsFixture,
    )
    vi.mocked(getOpportunities).mockImplementation(({ page = 1 } = {}) =>
      Promise.resolve(
        page === 2 ? opportunitiesPageTwoFixture : opportunitiesPageOneFixture,
      ),
    )
    vi.mocked(createOpportunity).mockResolvedValue({ message: 'OK' })
    vi.mocked(createOpportunityDraft).mockResolvedValue({ message: 'OK' })
    vi.mocked(createOpportunityProfitDistribution).mockResolvedValue(
      createdProfitDistributionResponse,
    )
    vi.mocked(updateOpportunity).mockResolvedValue({
      message: 'Opportunity updated.',
    })
    vi.mocked(deleteOpportunity).mockResolvedValue({ message: 'Deleted' })
  })

  it('renders the investment opportunities screen with loading, filtering, and pagination', async () => {
    renderInvestmentOpportunitiesRoute()


    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="dashboard-action-filter-row"]'),
      ).not.toBeNull()
    })

    expect(screen.getAllByText('الفرص الاستثمارية')).not.toHaveLength(0)
    const actionFilterRow = document.querySelector(
      '[data-slot="dashboard-action-filter-row"]',
    )
    expect(actionFilterRow).not.toBeNull()
    expect(
      within(actionFilterRow).getByRole('button', {
        name: 'إضافة فرصة استثمارية',
      }),
    ).toBeInTheDocument()
    expect(
      actionFilterRow.querySelector('[data-slot="dashboard-filter-swiper"]'),
    ).not.toBeNull()
    expect(
      actionFilterRow.querySelectorAll('[data-slot="dashboard-filter-slide"]'),
    ).toHaveLength(3)
    expect(within(actionFilterRow).getByText('21')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /الرياض/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'التالي' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'السابق' })).toBeDisabled()
    expect(
      screen.getByRole('button', { current: 'page', name: '1' }),
    ).toBeInTheDocument()
    expect(screen.getByText('RES-RYD-001')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))

    await waitFor(() => {
      expect(screen.getByText('RES-JED-023')).toBeInTheDocument()
    })

    expect(
      screen.getByRole('button', { current: 'page', name: '2' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('RES-RYD-001')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /جدة/ }))

    await waitFor(() => {
      expect(screen.getByText('RES-JED-023')).toBeInTheDocument()
    })

    expect(
      screen.getByRole('button', { current: 'page', name: '2' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'السابق' })).not.toBeDisabled()
    expect(screen.queryByText('RES-RYD-001')).not.toBeInTheDocument()
    expect(screen.getByText('RES-JED-023')).toBeInTheDocument()

    const cardRegion = screen.getByLabelText('بطاقات الفرص الاستثمارية')
    expect(within(cardRegion).getAllByText('منشورة')).not.toHaveLength(0)
  })

  it('navigates from the toolbar add button to the add opportunity page', async () => {
    const { router } = renderInvestmentOpportunitiesRoute()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /إضافة فرصة استثمارية|add/i }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'إضافة فرصة استثمارية' }),
    )

    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunityAdd,
    )
    expect(
      screen.getByRole('heading', { name: 'إضافة فرصة استثمارية جديدة' }),
    ).toBeInTheDocument()
  })

  it('navigates from an opportunity card to the id details page', async () => {
    const { router } = renderInvestmentOpportunitiesRoute()

    await waitFor(() => {
      expect(screen.getByText('RES-RYD-001')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('link', { name: /RES-RYD-001/ }))

    expect(router.state.location.pathname).toBe(
      buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
    )
    expect(
      screen.getByRole('heading', {
        name: 'عرض تفاصيل الفرصة الاستثمارية',
      }),
    ).toBeInTheDocument()
  })

  it('renders the add opportunity form sections and actions', () => {
    renderInvestmentOpportunitiesRoute({
      initialEntries: [ROUTE_PATHS.investmentOpportunityAdd],
    })

    expect(
      screen.getByRole('heading', { name: 'إضافة فرصة استثمارية جديدة' }),
    ).toBeInTheDocument()
    expect(screen.getByText('تفاصيل العقار')).toBeInTheDocument()
    expect(screen.getByText('تفاصيل المشغل')).toBeInTheDocument()
    expect(screen.getByText('المعلومات المالية')).toBeInTheDocument()
    expect(screen.getByText('اعدادات الاستثمار')).toBeInTheDocument()
    expect(screen.getByLabelText(/العنوان بالعربية/)).toBeInTheDocument()
    expect(screen.getByLabelText(/العنوان بالإنجليزية/)).toBeInTheDocument()
    expect(
      screen.getByTestId('investment-property-images-upload'),
    ).toHaveTextContent('انقر للرفع')
    expect(screen.getByRole('button', { name: 'التالي' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'الغاء' })).toBeInTheDocument()
  })

  it('returns to the list page when cancel is clicked', () => {
    vi.useFakeTimers()
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [ROUTE_PATHS.investmentOpportunityAdd],
    })

    fireEvent.click(screen.getByRole('button', { name: 'الغاء' }))

    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunities,
    )
    expect(screen.getByTestId('investment-skeleton')).toBeInTheDocument()
  })

  it.skip('continues to review without triggering publish request', async () => {
    
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [ROUTE_PATHS.investmentOpportunityAdd],
    })

    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))

    await waitFor(() => {
      expect(deleteOpportunity).toHaveBeenCalledWith('investment-riyadh-001')
    })
    await waitFor(() => {
      expect(deleteOpportunity).toHaveBeenCalledWith('investment-riyadh-001')
    })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunityAdd,
    )
    expect(
      await screen.findByRole('dialog', {
        name: 'عرض تفاصيل الفرصة الاستثمارية',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('فرصة الرياض'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Modern Residential Complex in North Riyadh'),
    ).toBeInTheDocument()
    expect(screen.getByText('شركة الأفق العقارية')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'نشر الفرصة' }),
    ).toBeInTheDocument()
  })

  it.skip('closes the review dialog without leaving the add page', async () => {
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [ROUTE_PATHS.investmentOpportunityAdd],
    })

    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))

    expect(
      await screen.findByRole('dialog', {
        name: 'عرض تفاصيل الفرصة الاستثمارية',
      }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'إغلاق نافذة مراجعة الفرصة' }),
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunityAdd,
    )
  })

  it.skip('publishes through API and returns to the list page', async () => {
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [ROUTE_PATHS.investmentOpportunityAdd],
    })

    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
    fireEvent.click(await screen.findByRole('button', { name: 'نشر الفرصة' }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunities,
    )
    expect(screen.getByTestId('investment-skeleton')).toBeInTheDocument()
  })

  it('renders the id details page and navigates to the distributions tab', async () => {
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
      ],
    })

    expect(
      screen.getByRole('link', {
        name: 'تفاصيل الفرصة الاستثمارية',
        current: 'page',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'توزيعات الأرباح' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'تعديل' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'حذف' })).not.toBeInTheDocument()
    expect(await screen.findByText('4,800,000')).toBeInTheDocument()
    expect(screen.getByText('اعدادات الاستثمار')).toBeInTheDocument()
    expect(screen.getByText('تفاصيل المشغل')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'توزيعات الأرباح' }))

    expect(router.state.location.pathname).toBe(
      buildInvestmentOpportunityProfitDistributionsPath(
        'investment-riyadh-001',
      ),
    )
  })

  it('navigates from the details edit button to the populated edit page', async () => {
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
      ],
    })

    fireEvent.click(screen.getByRole('button', { name: 'تعديل' }))

    expect(router.state.location.pathname).toBe(
      buildInvestmentOpportunityEditPath('investment-riyadh-001'),
    )
    expect(
      screen.getByRole('heading', { name: 'تعديل الفرصة الاستثمارية' }),
    ).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByDisplayValue('4800000.00')).toBeInTheDocument()
    })
    expect(screen.getAllByDisplayValue('Riyadh Opportunity')).toHaveLength(2)
    expect(screen.getByDisplayValue('نجد كابيتال')).toBeInTheDocument()
  })

  it('opens, cancels, and confirms the delete modal without calling an API', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.mocked(getOpportunityById).mockResolvedValueOnce({
      ...opportunityDetailsFixture,
      status: 'draft',
    })
    const detailsPath = buildInvestmentOpportunityDetailsPath(
      'investment-riyadh-001',
    )
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [detailsPath],
    })

    expect(await screen.findByText('4,800,000')).toBeInTheDocument()
    fireEvent.click(await screen.findByRole('button', { name: 'حذف' }))

    const cancelDialog = await screen.findByRole('dialog', {
      name: 'حذف الفرصة الاستثمارية',
    })
    expect(
      within(cancelDialog).getByText(
        'هل أنت متأكد من حذف الفرصة الاستثمارية؟ لا يمكن التراجع عن هذا الإجراء.',
      ),
    ).toBeInTheDocument()
    expect(
      within(cancelDialog).getByRole('button', { name: 'إغلاق النافذة' }),
    ).toBeInTheDocument()

    fireEvent.click(
      within(cancelDialog).getByRole('button', { name: /إلغاء|الغاء/i }),
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(router.state.location.pathname).toBe(detailsPath)

    fireEvent.click(await screen.findByRole('button', { name: 'حذف' }))

    const confirmDialog = await screen.findByRole('dialog', {
      name: 'حذف الفرصة الاستثمارية',
    })

    fireEvent.click(within(confirmDialog).getByRole('button', { name: 'حذف' }))

    await waitFor(() => {
      expect(deleteOpportunity).toHaveBeenCalled()
      expect(vi.mocked(deleteOpportunity).mock.calls[0]?.[0]).toBe(
        'investment-riyadh-001',
      )
    })
    expect(fetchMock).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(router.state.location.pathname).toBe(
        ROUTE_PATHS.investmentOpportunities,
      )
    })
    expect(
      await screen.findByText('تم حذف الفرصة الاستثمارية بنجاح'),
    ).toBeInTheDocument()
  })

  it('hides delete action on details page when opportunity status is not draft', async () => {
    renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
      ],
    })

    expect(await screen.findByText('4,800,000')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'حذف' }),
    ).not.toBeInTheDocument()
  })

  it('saves the edit page through update API and returns to details', async () => {
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityEditPath('investment-riyadh-001'),
      ],
    })

    await waitFor(() => {
      expect(document.getElementById('propertyPrice')?.value).toBe('4800000.00')
    })

    fireEvent.change(
      screen.getByLabelText(
        /\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629/,
      ),
      {
        target: {
          value:
            '\u0645\u062c\u0645\u0639 \u0633\u0643\u0646\u064a \u0645\u0639\u062f\u0644 \u0641\u064a \u0634\u0645\u0627\u0644 \u0627\u0644\u0631\u064a\u0627\u0636',
        },
      },
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: '\u062d\u0641\u0638 \u0627\u0644\u062a\u0639\u062f\u064a\u0644\u0627\u062a',
      }),
    )

    await waitFor(() => {
      expect(updateOpportunity).toHaveBeenCalledTimes(1)
    })
    const [savedOpportunityId, savedFormData] =
      vi.mocked(updateOpportunity).mock.calls[0]
    expect(savedOpportunityId).toBe('investment-riyadh-001')
    expect(savedFormData instanceof FormData).toBe(true)
    expect(savedFormData.get('title')).toBe(
      '\u0645\u062c\u0645\u0639 \u0633\u0643\u0646\u064a \u0645\u0639\u062f\u0644 \u0641\u064a \u0634\u0645\u0627\u0644 \u0627\u0644\u0631\u064a\u0627\u0636',
    )
    expect(savedFormData.get('city_id')).toBe(
      'a18cc8cc-0ebb-4888-800e-9d7c375674c6',
    )

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(
        buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
      )
    })
    expect(
      await screen.findByText(
        '\u062a\u0645 \u062a\u0639\u062f\u064a\u0644 \u0627\u0644\u0641\u0631\u0635\u0629 \u0627\u0644\u0627\u0633\u062a\u062b\u0645\u0627\u0631\u064a\u0629 \u0628\u0646\u062c\u0627\u062d',
      ),
    ).toBeInTheDocument()
  })

  it('omits city_id from edit payload when current city does not exist in cities API', async () => {
    vi.mocked(getCities).mockResolvedValueOnce([
      {
        id: 'known-city-id',
        name_ar: '\u0627\u0644\u0631\u064a\u0627\u0636',
        name_en: 'Riyadh',
      },
    ])

    renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityEditPath('investment-riyadh-001'),
      ],
    })

    fireEvent.change(document.querySelector('input[name="cityId"]'), {
      target: { value: 'missing-city-id' },
    })
    fireEvent.click(
      screen.getByRole('button', {
        name: '\u062d\u0641\u0638 \u0627\u0644\u062a\u0639\u062f\u064a\u0644\u0627\u062a',
      }),
    )

    await waitFor(() => {
      expect(updateOpportunity).toHaveBeenCalledTimes(1)
    })
    const savedFormData = vi.mocked(updateOpportunity).mock.calls[0]?.[1]
    expect(savedFormData instanceof FormData).toBe(true)
    expect(savedFormData.get('city_id')).toBeNull()
  })

  it('shows the unsaved edit modal only after dirty back navigation', async () => {
    const editPath = buildInvestmentOpportunityEditPath('investment-riyadh-001')
    const detailsPath = buildInvestmentOpportunityDetailsPath(
      'investment-riyadh-001',
    )
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [editPath],
    })

    await waitFor(() => {
      expect(document.getElementById('propertyPrice')?.value).toBe('4800000.00')
    })

    fireEvent.change(screen.getByLabelText(/العنوان بالعربية/), {
      target: { value: 'تغيير غير محفوظ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'الغاء' }))

    const stayDialog = await screen.findByRole('dialog', {
      name: 'مغادرة الصفحة دون حفظ؟',
    })
    expect(
      within(stayDialog).getByRole('button', { name: 'إغلاق النافذة' }),
    ).toBeInTheDocument()

    fireEvent.click(within(stayDialog).getByRole('button', { name: 'البقاء' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(router.state.location.pathname).toBe(editPath)

    fireEvent.click(screen.getByRole('button', { name: 'الغاء' }))

    const leaveDialog = await screen.findByRole('dialog', {
      name: 'مغادرة الصفحة دون حفظ؟',
    })

    fireEvent.click(within(leaveDialog).getByRole('button', { name: 'مغادرة' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(detailsPath)
    })
  })

  it('opens and cancels the add distribution modal without leaving the distributions page', async () => {
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityProfitDistributionsPath(
          'investment-riyadh-001',
        ),
      ],
    })

    fireEvent.click(screen.getByRole('button', { name: 'اضافة توزيعات' }))

    expect(
      await screen.findByRole('dialog', {
        name: 'اضافة توزيعات ارباح للمستثمرين',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'قم بتسجيل صافي العائد ليتم توزيع الأرباح على المحافظ الاستثمارية',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('قم بإدخال صافي العائد'),
    ).toBeInTheDocument()
    expect(
      within(screen.getByRole('dialog')).getByRole('img', { name: 'ريال' }),
    ).toBeInTheDocument()
    const distributionDateInput = within(
      screen.getByRole('dialog'),
    ).getByLabelText('تاريخ التوزيع')
    expect(distributionDateInput).toBeInTheDocument()
    expect(distributionDateInput).toHaveAttribute('readonly')
    expect(
      screen.getByRole('button', { name: 'اضافة التوزيعات' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'الغاء' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(router.state.location.pathname).toBe(
      buildInvestmentOpportunityProfitDistributionsPath(
        'investment-riyadh-001',
      ),
    )
  })

  it('submits the add distribution modal through API and shows success toast', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityProfitDistributionsPath(
          'investment-riyadh-001',
        ),
      ],
    })

    fireEvent.click(screen.getByRole('button', { name: 'اضافة توزيعات' }))
    fireEvent.change(
      await screen.findByPlaceholderText('قم بإدخال صافي العائد'),
      {
        target: { value: '5540000' },
      },
    )
    fireEvent.click(screen.getByRole('button', { name: 'اضافة التوزيعات' }))

    await waitFor(() => {
      expect(createOpportunityProfitDistribution).toHaveBeenCalledTimes(1)
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      await screen.findByText('تم اضافة توزيعات ارباح المستثمرين بنجاح'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'تم اضافة صافي العائد من توزيعات الارباح على المحافظ الاستثمارية',
      ),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'إغلاق' }))

    await waitFor(() => {
      expect(
        screen.queryByText('تم اضافة توزيعات ارباح المستثمرين بنجاح'),
      ).not.toBeInTheDocument()
    })
  })

  it('opens and closes the distribution details modal from the eye action', async () => {
    const profitDistributionsPath =
      buildInvestmentOpportunityProfitDistributionsPath('investment-riyadh-001')
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [profitDistributionsPath],
    })

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /عرض توزيع|distribution/i }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: /عرض توزيع|distribution/i }),
    )

    await waitFor(() => {
      expect(getProfitDistributionById).toHaveBeenCalledWith(
        'a192b204-cce2-4324-9cf8-847ea1aef4c9',
      )
    })

    const detailsDialog = await screen.findByRole('dialog', {
      name: 'تفاصيل التوزيع',
    })
    expect(
      within(detailsDialog).getAllByText(
        'جميع تفاصيل التوزيع التي تُمكّنك من مراجعة صافي الربح، تاريخ التوزيع، منفّذ العملية، وقائمة المستثمرين مع أرباحهم المستحقة في مكان واحد لسهولة المتابعة والرقابة.',
      ),
    ).not.toHaveLength(0)
    expect(within(detailsDialog).getAllByText('15,000.00')).not.toHaveLength(0)
    expect(within(detailsDialog).getByText('2026-04-15')).toBeInTheDocument()
    expect(within(detailsDialog).getAllByText('3')).not.toHaveLength(0)
    expect(
      within(detailsDialog).getByText('بيانات المنفّذ'),
    ).toBeInTheDocument()
    expect(within(detailsDialog).getByText('ADM-001')).toBeInTheDocument()
    expect(
      within(detailsDialog).getByText('قائمة المستثمرين في هذا التوزيع'),
    ).toBeInTheDocument()
    expect(within(detailsDialog).getByText('1 مستثمر')).toBeInTheDocument()
    expect(within(detailsDialog).getByText('Test User')).toBeInTheDocument()

    fireEvent.click(
      within(detailsDialog).getByRole('button', {
        name: 'إغلاق تفاصيل التوزيع',
      }),
    )

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(router.state.location.pathname).toBe(profitDistributionsPath)
  })

  it('shows loading skeleton in details modal while details API is pending', async () => {
    vi.mocked(getProfitDistributionById).mockImplementationOnce(
      () => new Promise(() => {}),
    )
    renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityProfitDistributionsPath(
          'investment-riyadh-001',
        ),
      ],
    })

    fireEvent.click(
      await screen.findByRole('button', { name: /عرض توزيع|distribution/i }),
    )

    expect(
      await screen.findByTestId('distribution-details-modal-skeleton'),
    ).toBeInTheDocument()
  })

  it('keeps modal open on details API error and retries successfully', async () => {
    vi.mocked(getProfitDistributionById)
      .mockRejectedValueOnce(new Error('details error'))
      .mockResolvedValueOnce(profitDistributionDetailsFixture)

    renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityProfitDistributionsPath(
          'investment-riyadh-001',
        ),
      ],
    })

    fireEvent.click(
      await screen.findByRole('button', { name: /عرض توزيع|distribution/i }),
    )

    const detailsDialog = await screen.findByRole('dialog', {
      name: 'تفاصيل التوزيع',
    })
    expect(
      await within(detailsDialog).findByTestId('distribution-details-modal-error'),
    ).toBeInTheDocument()

    fireEvent.click(
      within(detailsDialog).getByRole('button', { name: 'إعادة المحاولة' }),
    )

    await waitFor(() => {
      expect(getProfitDistributionById).toHaveBeenCalledTimes(2)
    })
    expect(await within(detailsDialog).findAllByText('15,000.00')).not.toHaveLength(0)
  })

  it('renders the profit distributions id page with mock rows and pagination', async () => {
    renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityProfitDistributionsPath(
          'investment-riyadh-001',
        ),
      ],
    })

    expect(
      screen.getByRole('link', {
        name: 'توزيعات الأرباح',
        current: 'page',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'جميع توزيعات الارباح' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/مجموع التوزيعات/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'اضافة توزيعات' }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText('عبد العزيز أحمد سالم الهاشمي'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('AQIN001')).not.toHaveLength(0)
    expect(screen.getByRole('button', { name: 'التالي' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'السابق' })).toBeInTheDocument()
  })
  it.skip('keeps user on add page and blocks draft API when basic information is missing', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [ROUTE_PATHS.investmentOpportunityAdd],
    })

    fireEvent.click(screen.getByRole('button', { name: /مسودة|draft/i }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunityAdd,
    )
    expect(await screen.findByText(/المسودة/)).toBeInTheDocument()
  })

  it.skip('saves draft via API and redirects to list when basic information is filled', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [ROUTE_PATHS.investmentOpportunityAdd],
    })

    fireEvent.change(document.getElementById('titleAr'), {
      target: { value: 'مسودة فرصة الرياض' },
    })
    fireEvent.change(document.getElementById('titleEn'), {
      target: { value: 'Riyadh Draft Opportunity' },
    })
    fireEvent.click(screen.getByRole('button', { name: /مسودة|draft/i }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunities,
    )
    expect(await screen.findByText(/كمسودة/)).toBeInTheDocument()
  })
})
