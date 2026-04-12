import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  act,
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
import { AuthProvider } from '@/features/auth/context/auth-provider'
import { DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY } from '@/features/dashboard/constants/dashboard-storage'
import DashboardPage from '@/features/dashboard/pages/dashboard-page'
import { dashboardRouteMeta } from '@/features/dashboard/routes/dashboard.route'
import { AppDirectionProvider } from '@/lib/i18n/direction-provider'
import i18n from '@/lib/i18n'
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/language'

async function renderDashboardRoute({
  initialEntries = ['/app/dashboard'],
  preserveSidebarStorage = false,
  sidebarCollapsed,
  language = 'ar',
  authenticated = true,
} = {}) {
  if (!preserveSidebarStorage) {
    window.localStorage.removeItem(DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY)
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)

  if (authenticated) {
    window.localStorage.setItem('authToken', 'test-auth-token')
    window.localStorage.setItem(
      'authUser',
      JSON.stringify({
        id: 'admin-1',
        email: 'admin@aqarinn.test',
        full_name_ar: 'مدير النظام',
        full_name_en: 'System Admin',
      }),
    )
  } else {
    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('authUser')
  }

  if (sidebarCollapsed === true) {
    window.localStorage.setItem(DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY, 'true')
  } else if (sidebarCollapsed === false) {
    window.localStorage.setItem(
      DASHBOARD_SIDEBAR_COLLAPSED_STORAGE_KEY,
      'false',
    )
  }

  await act(async () => {
    await i18n.changeLanguage(language)
  })

  const router = createMemoryRouter(
    [
      {
        path: '/login',
        element: <div>Login page</div>,
      },
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

function freezeDashboardClock() {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-04-12T12:00:00.000Z'))
}

async function renderDashboardRouteAtFrozenTime(options) {
  freezeDashboardClock()
  const result = await renderDashboardRoute(options)
  vi.useRealTimers()
  return result
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

function getSummaryPanel(title) {
  return screen.getByRole('region', { name: title })
}

function expectMetricTile(panel, metricKey, value) {
  const metricTile = panel.querySelector(
    `[data-slot="dashboard-transactions-metric"][data-metric-key="${metricKey}"]`,
  )

  expect(metricTile).not.toBeNull()
  expect(within(metricTile).getByText(value)).toBeInTheDocument()
}

function expectPanelSummary(title, { count, amount }) {
  const panel = getSummaryPanel(title)
  expectMetricTile(panel, 'count', count)
  expectMetricTile(panel, 'total-amount', amount)
  return panel
}

describe('DashboardPage route', () => {
  afterEach(async () => {
    vi.useRealTimers()
    window.localStorage.clear()
    await act(async () => {
      await i18n.changeLanguage('ar')
    })
  })

  it('renders the figma-based dashboard shell and transactions overview in Arabic', async () => {
    await renderDashboardRouteAtFrozenTime()

    expect(screen.getAllByText('لوحة المعلومات')).not.toHaveLength(0)
    expect(screen.getByText('الفرص الاستثمارية')).toBeInTheDocument()
    expect(screen.getByText('ادارة المستخدمين')).toBeInTheDocument()
    expect(screen.queryByText('توزيعات الأرباح')).not.toBeInTheDocument()
    expect(screen.queryByText('سجل النشاطات')).not.toBeInTheDocument()

    expect(screen.getByText('ملخص مؤشرات الأداء الرئيسية')).toBeInTheDocument()
    expect(screen.getByText('إجمالي فرص الاستثمار')).toBeInTheDocument()
    expect(
      screen.getByText('أفضل فرص الاستثمار حسب المبلغ الممول'),
    ).toBeInTheDocument()

    const transactionsSection = screen.getByRole('region', {
      name: 'نظرة عامة على المعاملات',
    })
    expect(transactionsSection).toBeInTheDocument()
    expect(
      within(transactionsSection).getByText(
        'تابع الاستثمارات وطلبات السحب والتوزيعات عبر نطاقات الوقت والفلاتر التشغيلية.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'اليوم' })).toHaveAttribute(
      'data-state',
      'active',
    )
    expect(screen.getByLabelText('الفرصة الاستثمارية')).toBeInTheDocument()
    expect(screen.getByLabelText('الحالة')).toBeInTheDocument()
    expect(screen.getByLabelText('المدينة')).toBeInTheDocument()
    expect(screen.queryByText('89,000')).not.toBeInTheDocument()
    expect(screen.queryByText('480,000')).not.toBeInTheDocument()
    expect(screen.queryByText('285,000')).not.toBeInTheDocument()

    expectPanelSummary('الاستثمارات', { count: '2', amount: '165,000' })
    const withdrawalsPanel = expectPanelSummary('طلبات السحب', {
      count: '1',
      amount: '80,000',
    })
    expectPanelSummary('التوزيعات', { count: '1', amount: '35,000' })

    const inProgressRow = withdrawalsPanel.querySelector(
      '[data-slot="dashboard-transactions-breakdown-row"][data-breakdown-key="in_progress"]',
    )
    const depositMadeRow = withdrawalsPanel.querySelector(
      '[data-slot="dashboard-transactions-breakdown-row"][data-breakdown-key="deposit_made"]',
    )

    expect(inProgressRow).not.toBeNull()
    expect(within(inProgressRow).getByText('العدد: 1')).toBeInTheDocument()
    expect(within(inProgressRow).getByText('80,000')).toBeInTheDocument()
    expect(depositMadeRow).not.toBeNull()
    expect(within(depositMadeRow).getAllByText('0')).not.toHaveLength(0)
    expect(screen.queryByText('English')).not.toBeInTheDocument()
  })

  it('shows custom date fields, validates them, and clears errors when switching back to a preset', async () => {
    await renderDashboardRouteAtFrozenTime()

    fireEvent.click(screen.getByRole('button', { name: 'مخصص' }))

    expect(await screen.findByText('تاريخ البداية مطلوب.')).toBeInTheDocument()
    expect(screen.getByText('تاريخ النهاية مطلوب.')).toBeInTheDocument()

    const startDateInput = screen.getByLabelText('من تاريخ')
    const endDateInput = screen.getByLabelText('إلى تاريخ')

    fireEvent.change(startDateInput, { target: { value: '2026-04-10' } })
    fireEvent.change(endDateInput, { target: { value: '2026-04-09' } })

    expect(
      await screen.findByText(
        'يجب أن يكون تاريخ النهاية بعد أو مساويًا لتاريخ البداية.',
      ),
    ).toBeInTheDocument()

    fireEvent.change(startDateInput, { target: { value: '2026-04-06' } })
    fireEvent.change(endDateInput, { target: { value: '2026-04-09' } })

    await waitFor(() => {
      expect(
        screen.queryByText(
          'يجب أن يكون تاريخ النهاية بعد أو مساويًا لتاريخ البداية.',
        ),
      ).not.toBeInTheDocument()
    })

    expectPanelSummary('الاستثمارات', { count: '0', amount: '0' })
    expectPanelSummary('طلبات السحب', { count: '2', amount: '103,000' })
    expectPanelSummary('التوزيعات', { count: '1', amount: '42,000' })

    fireEvent.click(screen.getByRole('button', { name: 'اليوم' }))

    await waitFor(() => {
      expect(screen.queryByLabelText('من تاريخ')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('إلى تاريخ')).not.toBeInTheDocument()
      expect(screen.queryByText('تاريخ البداية مطلوب.')).not.toBeInTheDocument()
      expect(screen.queryByText('تاريخ النهاية مطلوب.')).not.toBeInTheDocument()
    })

    expectPanelSummary('الاستثمارات', { count: '2', amount: '165,000' })
  })

  it('recalculates transactions when IO, status, and city filters change', async () => {
    await renderDashboardRouteAtFrozenTime()

    fireEvent.click(screen.getByRole('button', { name: 'آخر 30 يوماً' }))

    expectPanelSummary('الاستثمارات', { count: '5', amount: '497,000' })
    expectPanelSummary('طلبات السحب', { count: '4', amount: '285,000' })
    expectPanelSummary('التوزيعات', { count: '4', amount: '162,000' })

    fireEvent.change(screen.getByLabelText('الفرصة الاستثمارية'), {
      target: { value: 'jeddahCorniche' },
    })

    expectPanelSummary('الاستثمارات', { count: '2', amount: '132,000' })
    expectPanelSummary('طلبات السحب', { count: '1', amount: '65,000' })
    expectPanelSummary('التوزيعات', { count: '2', amount: '69,000' })

    fireEvent.change(screen.getByLabelText('الحالة'), {
      target: { value: 'in_progress' },
    })

    expectPanelSummary('الاستثمارات', { count: '2', amount: '132,000' })
    expectPanelSummary('طلبات السحب', { count: '0', amount: '0' })
    expectPanelSummary('التوزيعات', { count: '2', amount: '69,000' })

    fireEvent.change(screen.getByLabelText('المدينة'), {
      target: { value: 'riyadh' },
    })

    expectPanelSummary('الاستثمارات', { count: '0', amount: '0' })
    expectPanelSummary('طلبات السحب', { count: '0', amount: '0' })
    expectPanelSummary('التوزيعات', { count: '0', amount: '0' })
  })

  it('renders the transactions overview in English with localized labels and ltr direction', async () => {
    await renderDashboardRouteAtFrozenTime({ language: 'en' })

    const transactionsSection = screen.getByRole('region', {
      name: 'Transactions Overview',
    })
    expect(transactionsSection).toHaveAttribute('dir', 'ltr')
    expect(
      within(transactionsSection).getByText(
        'Track investments, withdrawals, and distributions across time and operational filters.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Last 7 days' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Last 30 days' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Custom' })).toBeInTheDocument()
    expect(screen.getByLabelText('IO')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
    expect(screen.getByLabelText('City')).toBeInTheDocument()

    expectPanelSummary('Investments', { count: '2', amount: '165,000' })
    expectPanelSummary('Withdrawals', { count: '1', amount: '80,000' })
    expectPanelSummary('Distributions', { count: '1', amount: '35,000' })
  })

  it('renders the notification bell menu with unread summary and localized actions from the topbar', async () => {
    await renderDashboardRouteAtFrozenTime()

    const notificationTrigger = screen.getByRole('button', {
      name: i18n.t('notificationsBar.triggerLabel', { ns: 'notifications' }),
    })

    expect(
      document.querySelector(
        '[data-slot="dashboard-notifications-trigger-indicator"]',
      ),
    ).not.toBeNull()

    fireEvent.pointerDown(notificationTrigger, { button: 0, ctrlKey: false })

    expect(
      await screen.findByText(
        i18n.t('notificationsBar.title', { ns: 'notifications' }),
      ),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(notificationTrigger).toHaveAttribute('aria-expanded', 'true')
    })

    expect(
      screen.getByText(
        i18n.t('notificationsBar.header.unreadCount', {
          ns: 'notifications',
          count: 7,
        }),
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: i18n.t('notificationsBar.actions.markAllAsRead', {
          ns: 'notifications',
        }),
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: i18n.t('notificationsBar.actions.viewAllNotifications', {
          ns: 'notifications',
        }),
      }),
    ).toBeInTheDocument()

    const menu = screen.getByRole('menu')
    expect(menu.className).toContain('w-[calc(100vw-32px)]')
    expect(menu.className).toContain('sm:w-[503px]')
    expect(menu.className).toContain('max-w-[503px]')

    expect(
      document.querySelector('[data-slot="dashboard-notifications-content"]'),
    ).toHaveAttribute('dir', 'rtl')
    expect(
      document.querySelector('[data-notification-id="notification-001"]'),
    ).toHaveAttribute('data-state', 'unread')

    fireEvent.pointerDown(document.body)

    await waitFor(() => {
      expect(
        screen.queryByText(
          i18n.t('notificationsBar.title', { ns: 'notifications' }),
        ),
      ).not.toBeInTheDocument()
    })
  })

  it.skip('opens and closes the notification bell menu from the topbar', async () => {
    await renderDashboardRoute()

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
    const { unmount } = await renderDashboardRoute()

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
    await renderDashboardRoute({ preserveSidebarStorage: true })

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
    await renderDashboardRoute({ sidebarCollapsed: true })

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
  it('redirects to login when the user is not authenticated', async () => {
    await renderDashboardRoute({ authenticated: false })

    expect(screen.getByText('Login page')).toBeInTheDocument()
  })
})
