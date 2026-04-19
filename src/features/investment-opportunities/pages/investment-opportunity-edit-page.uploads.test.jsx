import { act } from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import {
  buildInvestmentOpportunityDetailsPath,
  buildInvestmentOpportunityEditPath,
} from '@/app/router/route-paths'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import InvestmentOpportunityEditPage from '@/features/investment-opportunities/pages/investment-opportunity-edit-page'
import { getCities } from '@/features/investment-opportunities/services/investment-opportunity-service'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'

vi.mock(
  '@/features/investment-opportunities/services/investment-opportunity-service',
  () => ({
    getCities: vi.fn(),
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

function renderEditPage() {
  window.localStorage.setItem('aqarinn.backoffice.language', 'ar')
  window.localStorage.setItem('authToken', 'test-auth-token')
  window.localStorage.setItem(
    'authUser',
    JSON.stringify({
      id: 'admin-1',
      email: 'admin@aqarinn.test',
      full_name_ar: 'admin',
      full_name_en: 'System Admin',
      is_super_admin: true,
    }),
  )

  const opportunityId = 'investment-riyadh-001'
  const router = createMemoryRouter(
    [
      {
        path: '/app',
        element: <DashboardLayout />,
        children: [
          {
            path: 'investment-opportunities/:opportunityId/edit',
            element: <InvestmentOpportunityEditPage />,
            handle: {
              requiredPermissions: [],
            },
          },
          {
            path: 'investment-opportunities/:opportunityId',
            element: <div>Investment Opportunity Details Page</div>,
            handle: {
              requiredPermissions: [],
            },
          },
        ],
      },
    ],
    {
      initialEntries: [buildInvestmentOpportunityEditPath(opportunityId)],
    },
  )

  render(
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

  return { router, opportunityId }
}

function getFieldShell(inputId) {
  return document.getElementById(inputId).closest('.space-y-3')
}

describe('InvestmentOpportunityEditPage upload interactions', () => {
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
  })

  it('supports files modal, preview, append, and remove flows on edit page', async () => {
    renderEditPage()

    const initialDocument = new File(['doc'], 'ownership.pdf', {
      type: 'application/pdf',
    })
    const appendedDocument = new File(['doc-2'], 'license.pdf', {
      type: 'application/pdf',
    })
    const cover = new File(['cover'], 'cover.png', { type: 'image/png' })
    const gallery = new File(['gallery'], 'gallery.png', { type: 'image/png' })

    fireEvent.change(document.getElementById('propertyDocuments'), {
      target: { files: [initialDocument] },
    })
    fireEvent.change(document.getElementById('propertyImages'), {
      target: { files: [cover, gallery] },
    })

    const propertyDocumentsField = getFieldShell('propertyDocuments')
    const propertyImagesField = getFieldShell('propertyImages')

    await waitFor(() => {
      expect(
        within(propertyDocumentsField).getByRole('button', {
          name: /عرض الملفات المرفوعة/i,
        }),
      ).toBeInTheDocument()
      expect(
        within(propertyImagesField).getByRole('img', { name: /cover\.png/i }),
      ).toBeInTheDocument()
      expect(
        within(propertyImagesField).getByRole('img', { name: /gallery\.png/i }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      within(propertyDocumentsField).getByRole('button', {
        name: /عرض الملفات المرفوعة/i,
      }),
    )

    const filesDialog = await screen.findByRole('dialog', {
      name: 'المستندات المتاحة',
    })
    expect(within(filesDialog).getByText(/ownership\.pdf/i)).toBeInTheDocument()

    fireEvent.click(
      within(filesDialog).getByRole('button', { name: /معاينة ownership\.pdf/i }),
    )

    const previewDialog = await screen.findByRole('dialog', {
      name: /ownership\.pdf/i,
    })
    fireEvent.click(
      within(previewDialog).getByRole('button', {
        name: /الرجوع إلى قائمة الملفات/i,
      }),
    )

    const filesDialogAfterBack = await screen.findByRole('dialog', {
      name: 'المستندات المتاحة',
    })
    fireEvent.click(
      within(filesDialogAfterBack).getByRole('button', { name: /رفع ملف/i }),
    )

    fireEvent.change(document.getElementById('propertyDocuments'), {
      target: { files: [appendedDocument] },
    })

    await waitFor(() => {
      expect(
        within(filesDialogAfterBack).getByText(/ownership\.pdf/i),
      ).toBeInTheDocument()
      expect(within(filesDialogAfterBack).getByText(/license\.pdf/i)).toBeInTheDocument()
    })

    fireEvent.click(
      within(filesDialogAfterBack).getByRole('button', {
        name: /إزالة ownership\.pdf/i,
      }),
    )
    fireEvent.click(
      within(filesDialogAfterBack).getByRole('button', {
        name: /إغلاق نافذة الملفات/i,
      }),
    )

    await waitFor(() => {
      expect(within(propertyDocumentsField).queryByText(/ownership\.pdf/i)).not.toBeInTheDocument()
      expect(
        within(propertyDocumentsField).getByText(/license\.pdf/i),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      within(propertyImagesField).getByRole('button', { name: /إزالة cover\.png/i }),
    )

    await waitFor(() => {
      expect(
        within(propertyImagesField).queryByRole('img', { name: /cover\.png/i }),
      ).not.toBeInTheDocument()
      expect(
        within(propertyImagesField).getByRole('img', { name: /gallery\.png/i }),
      ).toBeInTheDocument()
    })
  })

  it('keeps unsaved-navigation confirmation working after upload interactions', async () => {
    const { router, opportunityId } = renderEditPage()
    const detailsPath = buildInvestmentOpportunityDetailsPath(opportunityId)

    const documentFile = new File(['doc'], 'unsaved.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(document.getElementById('propertyDocuments'), {
      target: { files: [documentFile] },
    })

    const propertyDocumentsField = getFieldShell('propertyDocuments')
    await waitFor(() => {
      expect(within(propertyDocumentsField).getByText(/unsaved\.pdf/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'الغاء' }))

    const stayDialog = await screen.findByRole('dialog', {
      name: 'مغادرة الصفحة دون حفظ؟',
    })
    fireEvent.click(within(stayDialog).getByRole('button', { name: 'البقاء' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(
        buildInvestmentOpportunityEditPath(opportunityId),
      )
    })

    fireEvent.click(screen.getByRole('button', { name: 'الغاء' }))

    const leaveDialog = await screen.findByRole('dialog', {
      name: 'مغادرة الصفحة دون حفظ؟',
    })
    fireEvent.click(within(leaveDialog).getByRole('button', { name: 'مغادرة' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(detailsPath)
    })
  })
})

