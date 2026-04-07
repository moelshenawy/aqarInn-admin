import { act } from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

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
  investmentOpportunitiesRouteMeta,
  investmentOpportunityAddRouteMeta,
  investmentOpportunityDetailsRouteMeta,
  investmentOpportunityEditRouteMeta,
  investmentOpportunityProfitDistributionsRouteMeta,
} from '@/features/investment-opportunities/routes/investment-opportunities.route'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'

function renderInvestmentOpportunitiesRoute({
  initialEntries = [ROUTE_PATHS.investmentOpportunities],
} = {}) {
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

async function finishInvestmentLoading() {
  await act(async () => {
    vi.advanceTimersByTime(500)
    await Promise.resolve()
  })
}

describe('InvestmentOpportunitiesPage route', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('renders the investment opportunities screen with loading, filtering, and pagination', async () => {
    vi.useFakeTimers()
    renderInvestmentOpportunitiesRoute()

    expect(screen.getByTestId('investment-skeleton')).toBeInTheDocument()

    await finishInvestmentLoading()

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

    await finishInvestmentLoading()

    expect(
      screen.getByRole('button', { current: 'page', name: '2' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('RES-RYD-001')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /جدة/ }))
    expect(screen.getByTestId('investment-skeleton')).toBeInTheDocument()

    await finishInvestmentLoading()

    expect(
      screen.getByRole('button', { current: 'page', name: '1' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'السابق' })).toBeDisabled()
    expect(screen.queryByText('RES-RYD-001')).not.toBeInTheDocument()
    expect(screen.getByText('RES-JED-023')).toBeInTheDocument()

    const cardRegion = screen.getByLabelText('بطاقات الفرص الاستثمارية')
    expect(within(cardRegion).getAllByText('منشورة')).not.toHaveLength(0)
  })

  it('navigates from the toolbar add button to the add opportunity page', async () => {
    vi.useFakeTimers()
    const { router } = renderInvestmentOpportunitiesRoute()

    await finishInvestmentLoading()

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
    vi.useFakeTimers()
    const { router } = renderInvestmentOpportunitiesRoute()

    await finishInvestmentLoading()

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

  it('submits locally and opens the review dialog without calling an API', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [ROUTE_PATHS.investmentOpportunityAdd],
    })

    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))

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
      screen.getByText('مجمع سكني حديث في شمال الرياض'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Modern Residential Complex in North Riyadh'),
    ).toBeInTheDocument()
    expect(screen.getByText('شركة الأفق العقارية')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'نشر الفرصة' })).toBeInTheDocument()
  })

  it('closes the review dialog without leaving the add page', async () => {
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

  it('publishes locally without calling an API and returns to the list page', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
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

  it('renders the id details page and navigates to the distributions tab', () => {
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
    expect(screen.getByRole('button', { name: 'حذف' })).toBeInTheDocument()
    expect(
      screen.getByText('مجمع سكني حديث في شمال الرياض'),
    ).toBeInTheDocument()
    expect(screen.getByText('2500000')).toBeInTheDocument()
    expect(screen.getByText('اعدادات الاستثمار')).toBeInTheDocument()
    expect(screen.getByText('تفاصيل المشغل')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'توزيعات الأرباح' }))

    expect(router.state.location.pathname).toBe(
      buildInvestmentOpportunityProfitDistributionsPath(
        'investment-riyadh-001',
      ),
    )
  })

  it('navigates from the details edit button to the populated edit page', () => {
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
    expect(
      screen.getByDisplayValue('مجمع سكني حديث في شمال الرياض'),
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue('2500000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('شركة الأفق العقارية')).toBeInTheDocument()
  })

  it('opens, cancels, and confirms the delete modal without calling an API', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const detailsPath = buildInvestmentOpportunityDetailsPath(
      'investment-riyadh-001',
    )
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [detailsPath],
    })

    fireEvent.click(screen.getByRole('button', { name: 'حذف' }))

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

    fireEvent.click(within(cancelDialog).getByRole('button', { name: 'الغاء' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(router.state.location.pathname).toBe(detailsPath)

    fireEvent.click(screen.getByRole('button', { name: 'حذف' }))

    const confirmDialog = await screen.findByRole('dialog', {
      name: 'حذف الفرصة الاستثمارية',
    })

    fireEvent.click(within(confirmDialog).getByRole('button', { name: 'حذف' }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunities,
    )
    expect(
      await screen.findByText('تم حذف الفرصة الاستثمارية بنجاح'),
    ).toBeInTheDocument()
  })

  it('saves the edit page locally without calling an API and returns to details', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityEditPath('investment-riyadh-001'),
      ],
    })

    fireEvent.change(screen.getByLabelText(/العنوان بالعربية/), {
      target: { value: 'مجمع سكني معدل في شمال الرياض' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'حفظ التعديلات' }))

    expect(fetchMock).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(router.state.location.pathname).toBe(
        buildInvestmentOpportunityDetailsPath('investment-riyadh-001'),
      )
    })
    expect(
      await screen.findByText('تم تعديل الفرصة الاستثمارية بنجاح'),
    ).toBeInTheDocument()
  })

  it('shows the unsaved edit modal only after dirty back navigation', async () => {
    const editPath = buildInvestmentOpportunityEditPath(
      'investment-riyadh-001',
    )
    const detailsPath = buildInvestmentOpportunityDetailsPath(
      'investment-riyadh-001',
    )
    const { router } = renderInvestmentOpportunitiesRoute({
      initialEntries: [editPath],
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
    ).getByDisplayValue('22/1/2026')
    expect(distributionDateInput).toBeInTheDocument()
    fireEvent.change(distributionDateInput, { target: { value: '23/1/2026' } })
    expect(distributionDateInput).toHaveValue('23/1/2026')
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

  it('submits the add distribution modal locally without API calls or table mutation', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    renderInvestmentOpportunitiesRoute({
      initialEntries: [
        buildInvestmentOpportunityProfitDistributionsPath(
          'investment-riyadh-001',
        ),
      ],
    })
    const rowCountBefore = screen.getAllByText('AQIN001').length

    fireEvent.click(screen.getByRole('button', { name: 'اضافة توزيعات' }))
    fireEvent.change(
      await screen.findByPlaceholderText('قم بإدخال صافي العائد'),
      {
        target: { value: '5540000' },
      },
    )
    fireEvent.click(screen.getByRole('button', { name: 'اضافة التوزيعات' }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getAllByText('AQIN001')).toHaveLength(rowCountBefore)
    expect(
      await screen.findByText(
        'تم اضافة توزيعات ارباح المستثمرين بنجاح',
      ),
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

  it('renders the profit distributions id page with mock rows and pagination', () => {
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
    expect(screen.getByText('243 مجموع التوزيعات')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'اضافة توزيعات' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('عبد العزيز أحمد سالم الهاشمي'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('AQIN001')).not.toHaveLength(0)
    expect(screen.getByRole('button', { name: 'التالي' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'السابق' })).toBeInTheDocument()
  })
})
