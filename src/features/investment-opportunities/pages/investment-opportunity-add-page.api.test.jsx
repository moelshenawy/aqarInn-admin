import { act } from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { Toaster } from '@/components/ui/sonner'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import InvestmentOpportunityAddPage from '@/features/investment-opportunities/pages/investment-opportunity-add-page'
import {
  investmentOpportunitiesRouteMeta,
  investmentOpportunityAddRouteMeta,
} from '@/features/investment-opportunities/routes/investment-opportunities.route'
import {
  createOpportunity,
  createOpportunityDraft,
  getCities,
} from '@/features/investment-opportunities/services/investment-opportunity-service'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'

vi.mock(
  '@/features/investment-opportunities/services/investment-opportunity-service',
  () => ({
    getCities: vi.fn(),
    createOpportunity: vi.fn(),
    createOpportunityDraft: vi.fn(),
  }),
)

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function renderAddPage() {
  window.localStorage.setItem('aqarinn.backoffice.language', 'ar')
  window.localStorage.setItem('authToken', 'test-auth-token')
  window.localStorage.setItem(
    'authUser',
    JSON.stringify({
      id: 'admin-1',
      email: 'admin@aqarinn.test',
      full_name_ar: 'admin',
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
            path: 'investment-opportunities',
            element: <div>Investment Opportunities Page</div>,
            handle: investmentOpportunitiesRouteMeta,
          },
          {
            path: 'investment-opportunities/add',
            element: <InvestmentOpportunityAddPage />,
            handle: investmentOpportunityAddRouteMeta,
          },
        ],
      },
    ],
    { initialEntries: [ROUTE_PATHS.investmentOpportunityAdd] },
  )

  render(
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

  return { router }
}

function getMainButtons() {
  const form = document.querySelector('form')
  const allButtons = Array.from(form.querySelectorAll('button'))
  const submitButton = allButtons.find((button) => button.type === 'submit')
  const draftButton = allButtons.filter((button) => button.type === 'button').at(-1)

  return { submitButton, draftButton }
}

async function fillPublishRequiredFields() {
  await waitFor(() => {
    const citySelect = document.getElementById('cityId')
    expect(citySelect).not.toBeNull()
    expect(
      citySelect.querySelector(
        'option[value="a18cc8cc-0ebb-4888-800e-9d7c375674c6"]',
      ),
    ).not.toBeNull()
  })

  fireEvent.change(document.getElementById('referenceCode'), {
    target: { value: 'OPP-1001' },
  })
  fireEvent.change(document.getElementById('titleAr'), {
    target: { value: 'Opportunity Riyadh AR' },
  })
  fireEvent.change(document.getElementById('titleEn'), {
    target: { value: 'Investment Opportunity - Riyadh' },
  })
  fireEvent.change(document.getElementById('cityId'), {
    target: { value: 'a18cc8cc-0ebb-4888-800e-9d7c375674c6' },
  })
  const mapDialog = await screen.findByRole('dialog')
  fireEvent.click(mapDialog.querySelectorAll('button')[0])
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
  fireEvent.change(document.getElementById('neighborhood'), {
    target: { value: 'Al Malqa' },
  })
  fireEvent.change(document.querySelector('input[name="latitude"]'), {
    target: { value: '24.7136' },
  })
  fireEvent.change(document.querySelector('input[name="longitude"]'), {
    target: { value: '46.6753' },
  })
  fireEvent.change(document.getElementById('propertyType'), {
    target: { value: 'residential' },
  })
  fireEvent.change(document.getElementById('propertyArea'), {
    target: { value: '3250' },
  })
  fireEvent.change(document.getElementById('propertyLocation'), {
    target: { value: 'Al Malqa, Riyadh' },
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
  fireEvent.change(document.getElementById('expectedNetReturn'), {
    target: { value: '437500' },
  })
  fireEvent.change(document.getElementById('returnFrequency'), {
    target: { value: 'quarterly' },
  })
  fireEvent.change(document.getElementById('investmentDurationMonths'), {
    target: { value: '24' },
  })
  fireEvent.change(document.getElementById('developerNameAr'), {
    target: { value: 'Developer AR' },
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
  const documentFile = new File(['doc'], 'brochure.pdf', {
    type: 'application/pdf',
  })
  fireEvent.change(document.getElementById('propertyDocuments'), {
    target: { files: [documentFile] },
  })
  fireEvent.change(document.getElementById('propertyImages'), {
    target: { files: [cover, gallery] },
  })
}

describe('InvestmentOpportunityAddPage API integration', () => {
  beforeEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('ar')
    })

    vi.mocked(getCities).mockResolvedValue([
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
    ])
    vi.mocked(createOpportunity).mockResolvedValue({ message: 'OK' })
    vi.mocked(createOpportunityDraft).mockResolvedValue({ message: 'OK' })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads cities and uses city_id option values', async () => {
    renderAddPage()

    await waitFor(() => {
      expect(getCities).toHaveBeenCalledTimes(1)
    })

    const citySelect = document.getElementById('cityId')
    await waitFor(() => {
      expect(
        citySelect.querySelector(
          'option[value="a18cc8cc-0ebb-4888-800e-9d7c375674c6"]',
        ),
      ).not.toBeNull()
    })

    fireEvent.change(citySelect, {
      target: { value: 'a18cc8cc-0ebb-4888-800e-9d7c375674c6' },
    })
    expect(citySelect.value).toBe('a18cc8cc-0ebb-4888-800e-9d7c375674c6')
  })

  it('does not save draft when basic information is missing', async () => {
    const { router } = renderAddPage()
    const { draftButton } = getMainButtons()

    fireEvent.click(draftButton)

    expect(createOpportunityDraft).not.toHaveBeenCalled()
    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunityAdd,
    )
  })

  it('saves draft when basic information is present', async () => {
    const { router } = renderAddPage()
    const { draftButton } = getMainButtons()

    fireEvent.change(document.getElementById('titleAr'), {
      target: { value: 'Draft AR' },
    })
    fireEvent.change(document.getElementById('titleEn'), {
      target: { value: 'Riyadh Draft Opportunity' },
    })

    fireEvent.click(draftButton)

    await waitFor(() => {
      expect(createOpportunityDraft).toHaveBeenCalledTimes(1)
    })
    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunities,
    )
  })

  it('continues to review then publishes on publish button only', async () => {
    const { router } = renderAddPage()
    const { submitButton } = getMainButtons()

    await fillPublishRequiredFields()
    fireEvent.click(submitButton)

    expect(createOpportunity).not.toHaveBeenCalled()
    const dialog = await screen.findByRole('dialog')
    const publishButton = dialog.querySelector('button.w-full')
    fireEvent.click(publishButton)

    await waitFor(() => {
      expect(createOpportunity).toHaveBeenCalledTimes(1)
    })
    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunities,
    )
  })

  it('shows uploaded files and renders only uploaded gallery images in review', async () => {
    renderAddPage()

    await fillPublishRequiredFields()

    await waitFor(() => {
      expect(screen.getByText(/cover\.png/)).toBeInTheDocument()
    })
    expect(screen.getByText(/gallery\.png/)).toBeInTheDocument()

    fireEvent.click(getMainButtons().submitButton)

    const dialog = await screen.findByRole('dialog')
    const gallerySection = within(dialog).getByLabelText(/ØµÙˆØ±|gallery/i)

    await waitFor(() => {
      expect(gallerySection.querySelectorAll('img[src^="blob:"]')).toHaveLength(2)
    })
  })
})

