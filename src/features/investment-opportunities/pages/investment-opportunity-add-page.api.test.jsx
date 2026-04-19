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

function getFieldShell(inputId) {
  return document.getElementById(inputId).closest('.space-y-3')
}

function installGoogleMapsMock() {
  const mapEvent = { removeListener: vi.fn() }

  class MockMap {
    addListener(eventName, callback) {
      if (eventName === 'click') {
        queueMicrotask(() => {
          callback({
            latLng: {
              lat: () => 24.7136,
              lng: () => 46.6753,
            },
          })
        })
      }
      return { remove: vi.fn() }
    }
  }

  class MockMarker {
    constructor() {}
    setPosition() {}
  }

  class MockGeocoder {
    geocode(_request, callback) {
      callback(
        [
          {
            address_components: [
              {
                types: ['neighborhood'],
                long_name: 'Al Malqa',
              },
              {
                types: ['locality'],
                long_name: 'Santiago del Estero',
              },
            ],
            formatted_address: 'Al Malqa, Santiago del Estero',
          },
        ],
        'OK',
      )
    }
  }

  window.google = {
    maps: {
      Map: MockMap,
      Marker: MockMarker,
      Geocoder: MockGeocoder,
      event: mapEvent,
    },
  }
}

async function fillPublishRequiredFields() {
  await waitFor(() => {
    expect(document.getElementById('propertyLocation')).not.toBeNull()
  })

  fireEvent.change(document.getElementById('titleAr'), {
    target: { value: 'Opportunity Riyadh AR' },
  })
  fireEvent.change(document.getElementById('titleEn'), {
    target: { value: 'Investment Opportunity - Riyadh' },
  })
  fireEvent.click(document.getElementById('propertyLocation'))
  const mapDialog = await screen.findByRole('dialog')
  const citySelect = mapDialog.querySelector('#neighborhood-map-city')
  fireEvent.change(citySelect, {
    target: { value: 'a18cc8cc-0ebb-4888-800e-9d7c375674c6' },
  })
  const mapDialogButtons = mapDialog.querySelectorAll('button')
  const confirmButton = mapDialogButtons[mapDialogButtons.length - 1]
  await waitFor(() => {
    expect(confirmButton).not.toBeDisabled()
  })
  fireEvent.click(confirmButton)
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
  fireEvent.change(document.getElementById('propertyType'), {
    target: { value: 'residential' },
  })
  fireEvent.change(document.getElementById('propertyArea'), {
    target: { value: '3250' },
  })
  fireEvent.change(document.getElementById('propertyPrice'), {
    target: { value: '3500000' },
  })
  fireEvent.change(document.getElementById('shareCount'), {
    target: { value: '1000' },
  })

  await waitFor(() => {
    expect(document.getElementById('sharePrice').value).toBe('3500.00')
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

  const propertyDocumentsField = getFieldShell('propertyDocuments')
  const propertyImagesField = getFieldShell('propertyImages')

  await waitFor(() => {
    expect(
      within(propertyDocumentsField).getAllByText(/brochure\.pdf/i).length,
    ).toBeGreaterThan(0)
    expect(
      within(propertyImagesField).getByRole('img', { name: /cover\.png/i }),
    ).toBeInTheDocument()
    expect(
      within(propertyImagesField).getByRole('img', { name: /gallery\.png/i }),
    ).toBeInTheDocument()
  })
}

describe('InvestmentOpportunityAddPage API integration', () => {
  beforeEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('ar')
    })

    installGoogleMapsMock()
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
    delete window.google
    vi.clearAllMocks()
  })

  it('loads cities and exposes city options in the location modal', async () => {
    renderAddPage()

    expect(document.getElementById('referenceCode')).toBeNull()

    await waitFor(() => {
      expect(getCities).toHaveBeenCalledTimes(1)
    })

    fireEvent.click(document.getElementById('propertyLocation'))
    const mapDialog = await screen.findByRole('dialog')
    const citySelect = mapDialog.querySelector('#neighborhood-map-city')
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

  it('fills property location with geocoded city and neighborhood even if city is not in API list', async () => {
    renderAddPage()

    await waitFor(() => {
      expect(document.getElementById('propertyLocation')).not.toBeNull()
    })

    fireEvent.click(document.getElementById('propertyLocation'))
    const mapDialog = await screen.findByRole('dialog')
    const citySelect = mapDialog.querySelector('#neighborhood-map-city')
    fireEvent.change(citySelect, {
      target: { value: 'a18cc8cc-0ebb-4888-800e-9d7c375674c6' },
    })

    const mapDialogButtons = mapDialog.querySelectorAll('button')
    const confirmButton = mapDialogButtons[mapDialogButtons.length - 1]
    await waitFor(() => {
      expect(confirmButton).not.toBeDisabled()
    })
    fireEvent.click(confirmButton)

    const propertyLocationInput = document.getElementById('propertyLocation')
    await waitFor(() => {
      expect(propertyLocationInput.value).toContain('Santiago del Estero')
      expect(propertyLocationInput.value).toContain('Al Malqa')
    })
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
    const draftPayload = vi.mocked(createOpportunityDraft).mock.calls[0]?.[0]
    expect(draftPayload.get('title_ar')).toBe('Draft AR')
    expect(draftPayload.get('title_en')).toBe('Riyadh Draft Opportunity')
    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunities,
    )
  })

  it('sends uploaded documents and gallery images in draft payload', async () => {
    renderAddPage()

    await fillPublishRequiredFields()
    fireEvent.click(getMainButtons().draftButton)

    await waitFor(() => {
      expect(createOpportunityDraft).toHaveBeenCalledTimes(1)
    })

    const draftPayload = vi.mocked(createOpportunityDraft).mock.calls[0]?.[0]
    expect(draftPayload.get('cover_image')).toBeInstanceOf(File)
    expect(draftPayload.getAll('images[]')).toHaveLength(1)
    expect(draftPayload.getAll('documents[]')).toHaveLength(1)
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
    const publishPayload = vi.mocked(createOpportunity).mock.calls[0]?.[0]
    expect(publishPayload instanceof FormData).toBe(true)
    expect(publishPayload.get('reference_code')).toBeNull()
    expect(router.state.location.pathname).toBe(
      ROUTE_PATHS.investmentOpportunities,
    )
  })

  it('shows uploaded files and renders only uploaded gallery images in review', async () => {
    renderAddPage()

    await fillPublishRequiredFields()
    const propertyImagesField = getFieldShell('propertyImages')

    await waitFor(() => {
      expect(
        within(propertyImagesField).getByRole('img', { name: /cover\.png/i }),
      ).toBeInTheDocument()
    })
    expect(
      within(propertyImagesField).getByRole('img', { name: /gallery\.png/i }),
    ).toBeInTheDocument()

    fireEvent.click(getMainButtons().submitButton)

    const dialog = await screen.findByRole('dialog')

    await waitFor(() => {
      expect(dialog.querySelectorAll('img[src^="blob:"]')).toHaveLength(2)
    })
  })

  it('opens files modal from the documents eye action and supports preview back flow', async () => {
    renderAddPage()

    await fillPublishRequiredFields()
    const propertyDocumentsField = getFieldShell('propertyDocuments')

    expect(
      within(propertyDocumentsField).getByRole('button', {
        name: /عرض الملفات المرفوعة/i,
      }),
    ).toBeInTheDocument()

    fireEvent.click(
      within(propertyDocumentsField).getByRole('button', {
        name: /عرض الملفات المرفوعة/i,
      }),
    )

    const filesDialog = await screen.findByRole('dialog', {
      name: 'المستندات المتاحة',
    })
    expect(within(filesDialog).getByText(/brochure\.pdf/i)).toBeInTheDocument()

    fireEvent.click(
      within(filesDialog).getByRole('button', { name: /معاينة brochure\.pdf/i }),
    )

    const previewDialog = await screen.findByRole('dialog', {
      name: /brochure\.pdf/i,
    })
    expect(
      within(previewDialog).getByRole('button', {
        name: /الرجوع إلى قائمة الملفات/i,
      }),
    ).toBeInTheDocument()

    fireEvent.click(
      within(previewDialog).getByRole('button', {
        name: /الرجوع إلى قائمة الملفات/i,
      }),
    )

    expect(
      await screen.findByRole('dialog', { name: 'المستندات المتاحة' }),
    ).toBeInTheDocument()
  })

  it('appends new documents when uploading from files modal', async () => {
    renderAddPage()

    await fillPublishRequiredFields()
    const propertyDocumentsField = getFieldShell('propertyDocuments')
    const additionalDocument = new File(['doc-2'], 'license.pdf', {
      type: 'application/pdf',
    })

    fireEvent.click(
      within(propertyDocumentsField).getByRole('button', {
        name: /عرض الملفات المرفوعة/i,
      }),
    )

    const filesDialog = await screen.findByRole('dialog', {
      name: 'المستندات المتاحة',
    })
    fireEvent.click(within(filesDialog).getByRole('button', { name: /رفع ملف/i }))

    fireEvent.change(document.getElementById('propertyDocuments'), {
      target: { files: [additionalDocument] },
    })

    await waitFor(() => {
      expect(within(filesDialog).getByText(/brochure\.pdf/i)).toBeInTheDocument()
      expect(within(filesDialog).getByText(/license\.pdf/i)).toBeInTheDocument()
    })
  })

  it('keeps RHF file values in sync when removing and re-uploading required files', async () => {
    renderAddPage()

    await fillPublishRequiredFields()

    const propertyDocumentsField = getFieldShell('propertyDocuments')
    const propertyImagesField = getFieldShell('propertyImages')

    fireEvent.click(
      within(propertyDocumentsField).getByRole('button', {
        name: /عرض الملفات المرفوعة/i,
      }),
    )

    const filesDialog = await screen.findByRole('dialog', {
      name: 'المستندات المتاحة',
    })

    await waitFor(() => {
      expect(
        within(filesDialog).getByRole('button', {
          name: /إزالة brochure\.pdf/i,
        }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      within(filesDialog).getByRole('button', { name: /إزالة brochure\.pdf/i }),
    )
    fireEvent.click(
      within(filesDialog).getByRole('button', { name: /إغلاق نافذة الملفات/i }),
    )

    await waitFor(() => {
      expect(
        within(propertyImagesField).getByRole('button', {
          name: /إزالة cover\.png/i,
        }),
      ).toBeInTheDocument()
      expect(
        within(propertyImagesField).getByRole('button', {
          name: /إزالة gallery\.png/i,
        }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      within(propertyImagesField).getByRole('button', { name: /إزالة cover\.png/i }),
    )
    fireEvent.click(
      within(propertyImagesField).getByRole('button', { name: /إزالة gallery\.png/i }),
    )

    await waitFor(() => {
      expect(within(propertyDocumentsField).queryByText(/brochure\.pdf/i)).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(
        within(propertyImagesField).queryByRole('img', { name: /cover\.png/i }),
      ).not.toBeInTheDocument()
      expect(
        within(propertyImagesField).queryByRole('img', { name: /gallery\.png/i }),
      ).not.toBeInTheDocument()
    })

    fireEvent.click(getMainButtons().submitButton)

    await waitFor(() => {
      expect(within(propertyDocumentsField).getByText('هذا الحقل مطلوب.')).toBeInTheDocument()
      expect(within(propertyImagesField).getByText('هذا الحقل مطلوب.')).toBeInTheDocument()
    })

    const replacementDocument = new File(['doc-2'], 'replacement.pdf', {
      type: 'application/pdf',
    })
    const replacementImage = new File(['cover-2'], 'replacement.png', {
      type: 'image/png',
    })

    fireEvent.change(document.getElementById('propertyDocuments'), {
      target: { files: [replacementDocument] },
    })
    fireEvent.change(document.getElementById('propertyImages'), {
      target: { files: [replacementImage] },
    })

    await waitFor(() => {
      expect(
        within(propertyDocumentsField).getAllByText(/replacement\.pdf/i).length,
      ).toBeGreaterThan(0)
      expect(
        within(propertyImagesField).getByRole('img', { name: /replacement\.png/i }),
      ).toBeInTheDocument()
      expect(within(propertyDocumentsField).queryByText('هذا الحقل مطلوب.')).not.toBeInTheDocument()
      expect(within(propertyImagesField).queryByText('هذا الحقل مطلوب.')).not.toBeInTheDocument()
    })

    fireEvent.click(getMainButtons().submitButton)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })
})

