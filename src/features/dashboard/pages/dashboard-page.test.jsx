import { afterEach, describe, expect, it } from 'vitest'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'

import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { TooltipProvider } from '@/components/ui/tooltip'
import DashboardPage from '@/features/dashboard/pages/dashboard-page'
import { dashboardRouteMeta } from '@/features/dashboard/routes/dashboard.route'
import { DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY } from '@/features/dashboard/constants/dashboard-storage'
import { AuthProvider } from '@/features/auth/context/auth-provider'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'

function renderDashboardRoute({
  initialEntries = ['/app/dashboard'],
  preserveSidebarStorage = false,
  sidebarCollapsed,
} = {}) {
  if (!preserveSidebarStorage) {
    window.localStorage.removeItem(DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY)
  }

  window.localStorage.setItem('aqarinn.backoffice.language', 'ar')

  if (sidebarCollapsed === true) {
    window.localStorage.setItem(DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY, 'true')
  } else if (sidebarCollapsed === false) {
    window.localStorage.setItem(
      DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY,
      'false',
    )
  }

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
      <AuthProvider>
        <AppDirectionProvider>
          <TooltipProvider delayDuration={0}>
            <RouterProvider router={router} />
          </TooltipProvider>
        </AppDirectionProvider>
      </AuthProvider>
    </I18nextProvider>,
  )
}

function getDesktopSidebar() {
  return document.querySelector(
    '[data-slot="dashboard-sidebar"][data-sidebar-context="desktop"]',
  )
}

function getMobileSidebar() {
  return document.querySelector(
    '[data-slot="dashboard-sidebar"][data-sidebar-context="mobile"]',
  )
}

describe('DashboardPage route', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

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

  it('opens and closes the notification bell menu from the topbar', async () => {
    renderDashboardRoute()

    const notificationTrigger = screen.getByRole('button', {
      name: 'الإشعارات',
    })

    fireEvent.pointerDown(notificationTrigger, { button: 0, ctrlKey: false })

    expect(await screen.findByText('جميع الاشعارات')).toBeInTheDocument()
    await waitFor(() => {
      expect(notificationTrigger).toHaveAttribute('aria-expanded', 'true')
    })
    expect(screen.getAllByText('إنجاز جديد 🎉')).not.toHaveLength(0)
    expect(
      screen.getAllByText('وصلت فرصة حي الربيع إلى 500 مستثمر'),
    ).not.toHaveLength(0)

    const menu = screen.getByRole('menu')
    expect(menu.className).toContain('w-[calc(100vw-32px)]')
    expect(menu.className).toContain('sm:w-[503px]')
    expect(menu.className).toContain('max-w-[503px]')

    fireEvent.pointerDown(notificationTrigger, { button: 0, ctrlKey: false })

    await waitFor(() => {
      expect(notificationTrigger).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByText('جميع الاشعارات')).not.toBeInTheDocument()
    })

    fireEvent.pointerDown(notificationTrigger, { button: 0, ctrlKey: false })
    expect(await screen.findByText('جميع الاشعارات')).toBeInTheDocument()

    fireEvent.pointerDown(document.body)

    await waitFor(() => {
      expect(screen.queryByText('جميع الاشعارات')).not.toBeInTheDocument()
    })
  })

  it('collapses, restores, and expands the desktop sidebar with persisted state', async () => {
    const { unmount } = renderDashboardRoute()

    const desktopSidebar = getDesktopSidebar()
    expect(desktopSidebar).toHaveAttribute('data-sidebar-state', 'expanded')

    const collapseButton = screen.getByRole('button', {
      name: 'طي القائمة الجانبية',
    })

    fireEvent.click(collapseButton)

    await waitFor(() => {
      expect(desktopSidebar).toHaveAttribute('data-sidebar-state', 'collapsed')
      expect(
        window.localStorage.getItem(DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY),
      ).toBe('true')
    })

    unmount()
    renderDashboardRoute({ preserveSidebarStorage: true })

    const restoredDesktopSidebar = getDesktopSidebar()
    expect(restoredDesktopSidebar).toHaveAttribute(
      'data-sidebar-state',
      'collapsed',
    )

    const restoredUsersLink = screen.getByRole('link', {
      name: 'ادارة المستخدمين',
    })
    const restoredUsersLabel = restoredUsersLink.querySelector(
      '[data-slot="dashboard-sidebar-label"]',
    )

    expect(restoredUsersLabel).toHaveAttribute('aria-hidden', 'true')

    fireEvent.focus(restoredUsersLink)

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveTextContent('ادارة المستخدمين')

    fireEvent.blur(restoredUsersLink)

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    const expandButton = screen.getByRole('button', {
      name: 'توسيع القائمة الجانبية',
    })

    fireEvent.click(expandButton)

    await waitFor(() => {
      expect(restoredDesktopSidebar).toHaveAttribute(
        'data-sidebar-state',
        'expanded',
      )
      expect(
        window.localStorage.getItem(DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY),
      ).toBe('false')
    })

    const expandedUsersLink = screen.getByRole('link', {
      name: 'ادارة المستخدمين',
    })
    const expandedUsersLabel = expandedUsersLink.querySelector(
      '[data-slot="dashboard-sidebar-label"]',
    )

    expect(expandedUsersLabel).not.toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the mobile sheet sidebar expanded and labeled even when desktop is collapsed', async () => {
    renderDashboardRoute({ sidebarCollapsed: true })

    expect(getDesktopSidebar()).toHaveAttribute(
      'data-sidebar-state',
      'collapsed',
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'فتح القائمة الجانبية' }),
    )

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="sheet-content"]'),
      ).not.toBeNull()
    })

    const mobileSidebar = getMobileSidebar()
    expect(mobileSidebar).toHaveAttribute('data-sidebar-state', 'expanded')
    expect(
      within(mobileSidebar).getByText('ادارة المستخدمين'),
    ).toBeInTheDocument()
  })
})
